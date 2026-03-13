-- Social-graph search: prioritize friends of friends, followers of friends, group members
-- Run in Supabase → SQL Editor → New Query → Run
-- Prerequisite: group_members table must exist (run migration_groups.sql first if needed)

CREATE OR REPLACE FUNCTION search_profiles_social(search_q text, current_user_id uuid)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_ids uuid[];
BEGIN
  -- Empty search: return no results (same as current behavior)
  IF trim(coalesce(search_q, '')) = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH candidates AS (
    SELECT p.id
    FROM profiles p
    WHERE p.id != current_user_id
      AND (
        p.username ILIKE '%' || trim(search_q) || '%'
        OR coalesce(p.display_name, '') ILIKE '%' || trim(search_q) || '%'
      )
      AND NOT EXISTS (
        SELECT 1 FROM follows f
        WHERE f.follower_id = current_user_id AND f.following_id = p.id
      )
  ),
  scores AS (
    SELECT c.id,
      coalesce(fof.pts, 0) + coalesce(fof2.pts, 0) + coalesce(grp.pts, 0) + 1 AS total
    FROM candidates c
    LEFT JOIN (
      -- Friends of friends: +3 per mutual (people I follow also follow this person)
      SELECT f1.following_id AS id, COUNT(*)::bigint * 3 AS pts
      FROM follows f2
      JOIN follows f1 ON f1.follower_id = f2.following_id AND f1.following_id != current_user_id
      WHERE f2.follower_id = current_user_id
      GROUP BY f1.following_id
    ) fof ON fof.id = c.id
    LEFT JOIN (
      -- Followers of friends: +2 (people who follow someone I follow)
      SELECT f1.follower_id AS id, COUNT(*)::bigint * 2 AS pts
      FROM follows f2
      JOIN follows f1 ON f1.following_id = f2.following_id AND f1.follower_id != current_user_id
      WHERE f2.follower_id = current_user_id
      GROUP BY f1.follower_id
    ) fof2 ON fof2.id = c.id
    LEFT JOIN (
      -- Group members: +2 (people in same groups as me)
      SELECT gm2.user_id AS id, COUNT(*)::bigint * 2 AS pts
      FROM group_members gm1
      JOIN group_members gm2 ON gm2.group_id = gm1.group_id AND gm2.user_id != gm1.user_id
      WHERE gm1.user_id = current_user_id
      GROUP BY gm2.user_id
    ) grp ON grp.id = c.id
  )
  SELECT p.*
  FROM profiles p
  JOIN scores s ON s.id = p.id
  ORDER BY s.total DESC, p.username ASC
  LIMIT 20;
END;
$$;

-- Grant execute to authenticated users (and anon if your app uses it)
GRANT EXECUTE ON FUNCTION search_profiles_social(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION search_profiles_social(text, uuid) TO anon;
