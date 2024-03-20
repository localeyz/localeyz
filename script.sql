-- Create the unique constraint on Email field of directus_user table, so duplicate entry of user won't happen
ALTER TABLE directus_users
ADD CONSTRAINT unique_email_constraint UNIQUE (email);

-- Copy data of users table into directus_user table
INSERT INTO directus_users (id, first_name, last_name, email, PASSWORD, LOCATION, title, description, tags, avatar,
	LANGUAGE, tfa_secret, status, ROLE, token, last_access, last_page, provider, external_identifier, auth_data, email_notifications, organization, linked_user, appearance, theme_dark, theme_light, theme_light_overrides, theme_dark_overrides, address, allow_password_change, bio, cablecast_producer_id, city, confirmation_sent_at, confirmation_token, confirmed_at, created_at, custom_field_value, is_active, neon_crm_id, nickname, phone, remember_created_at, reset_password_sent_at, reset_password_token, state, tokens, unconfirmed_email, updated_at, user_type, username, zipcode)
SELECT
	gen_random_uuid (),
	u.firstname AS first_name,
	u.lastname AS last_name,
	u.uid AS email,
	u.encrypted_password AS PASSWORD,
	NULL AS LOCATION,
	NULL AS title,
	NULL AS description,
	NULL AS tags,
	NULL AS avatar,
	NULL AS
	LANGUAGE,
	NULL AS tfa_secret,
	'active' AS status,
	NULL AS ROLE,
	NULL AS token,
	NULL AS last_access,
	NULL AS last_page,
	u.provider,
	NULL AS external_identifier,
	NULL AS auth_data,
	NULL AS email_notifications,
	u.organization_id AS organization,
	u.id AS linked_user,
	NULL AS appearance,
	NULL AS theme_dark,
	NULL AS theme_light,
	NULL AS theme_light_overrides,
	NULL AS theme_dark_overrides,
	u.address,
	u.allow_password_change,
	u.bio,
	u.cablecast_producer_id,
	u.city,
	u.confirmation_sent_at,
	u.confirmation_token,
	u.confirmed_at,
	u.created_at,
	u.custom_field_value,
	u.is_active,
	u.neon_crm_id,
	u.nickname,
	u.phone,
	u.remember_created_at,
	u.reset_password_sent_at,
	u.reset_password_token,
	u.state,
	u.tokens,
	u.unconfirmed_email,
	u.updated_at,
	u.user_type,
	u.username,
	u.zipcode
FROM
	users u ON CONFLICT (email)
	DO
	UPDATE
	SET
		first_name = EXCLUDED.first_name,
		last_name = EXCLUDED.last_name,
		PASSWORD = EXCLUDED.password,
		avatar = EXCLUDED.avatar,
		address = EXCLUDED.address,
		allow_password_change = EXCLUDED.allow_password_change,
		bio = EXCLUDED.bio,
		cablecast_producer_id = EXCLUDED.cablecast_producer_id,
		city = EXCLUDED.city,
		confirmation_sent_at = EXCLUDED.confirmation_sent_at,
		confirmation_token = EXCLUDED.confirmation_token,
		confirmed_at = EXCLUDED.confirmed_at,
		created_at = EXCLUDED.created_at,
		custom_field_value = EXCLUDED.custom_field_value,
		is_active = EXCLUDED.is_active,
		neon_crm_id = EXCLUDED.neon_crm_id,
		nickname = EXCLUDED.nickname,
		phone = EXCLUDED.phone,
		remember_created_at = EXCLUDED.remember_created_at,
		reset_password_sent_at = EXCLUDED.reset_password_sent_at,
		reset_password_token = EXCLUDED.reset_password_token,
		state = EXCLUDED.state,
		tokens = EXCLUDED.tokens,
		unconfirmed_email = EXCLUDED.unconfirmed_email,
		updated_at = EXCLUDED.updated_at,
		user_type = EXCLUDED.user_type,
		username = EXCLUDED.username,
		zipcode = EXCLUDED.zipcode,
		linked_user = EXCLUDED.linked_user;

-- Function creation to delete relation with User table and create relation with directus_user
CREATE OR REPLACE FUNCTION public.update_column_and_rename(table_name text, new_column_name text, old_column_name text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Step 1: Add a new column
    EXECUTE 'ALTER TABLE ' || table_name || ' ADD COLUMN ' || new_column_name || ' UUID';

    -- Step 2: Update the new column based on the old column
    EXECUTE 'UPDATE ' || table_name || ' SET ' || new_column_name ||
            ' = du.id FROM directus_users du WHERE ' || old_column_name || ' = du.linked_user';

    -- Step 3: Drop the old column
    EXECUTE 'ALTER TABLE ' || table_name || ' DROP COLUMN ' || old_column_name;

    -- Step 4: Rename the new column
    EXECUTE 'ALTER TABLE ' || table_name || ' RENAME COLUMN ' || new_column_name || ' TO ' || old_column_name;

	-- Step 5: Delete rows where old_column_name is NULL
    EXECUTE 'DELETE FROM ' || table_name || ' WHERE ' || old_column_name || ' IS NULL';
END;
$function$


-- Function calling to replace users value with directus_user id
SELECT update_column_and_rename('change_email_requests', 'requested_by_uuid', 'requested_by');
SELECT update_column_and_rename('change_email_requests', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('comments', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('episodes', 'producer_id_uuid', 'producer_id');
SELECT update_column_and_rename('podcasts', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('notification_settings', 'producer_id_uuid', 'producer_id');
SELECT update_column_and_rename('donation_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('footer_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('social_media_links', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('episodes_users', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('subscription_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('programs', 'producer_id_uuid', 'producer_id');
SELECT update_column_and_rename('invites', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('invites', 'invitee_id_uuid', 'invitee_id');
SELECT update_column_and_rename('invites', 'inviter_id_uuid', 'inviter_id');
SELECT update_column_and_rename('groups_users', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('producer_settings', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('groups', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('posts', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('search_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('vod_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('radio_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('radios', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('schedule_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('live_videos', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('live_video_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('producer_portal_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('programs_users', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('playlist_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('playlists', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('podcast_widgets', 'user_id_uuid', 'user_id');
SELECT update_column_and_rename('episodes_users', 'user_id_uuid', 'user_id');

-- Delete the orphan data
DELETE FROM external_links WHERE episode_id NOT IN( SELECT id FROM episodes);
DELETE FROM footer_columns WHERE footer_widget_id NOT IN( SELECT id FROM footer_widgets);
DELETE FROM footer_columns_links WHERE footer_column_id NOT IN( SELECT id FROM footer_columns);
DELETE FROM group_tags_groups WHERE group_id NOT IN( SELECT id FROM groups);
DELETE FROM group_tags_groups WHERE post_id NOT IN( SELECT id FROM posts);
DELETE FROM groups_users WHERE group_id NOT IN( SELECT id FROM groups);
DELETE FROM images WHERE donation_widget_id NOT IN( SELECT id FROM donation_widgets);
DELETE FROM images WHERE footer_widget_id NOT IN( SELECT id FROM footer_widgets);
DELETE FROM live_videos_schedule_widgets WHERE live_video_id NOT IN( SELECT id FROM live_videos);
DELETE FROM live_videos_schedule_widgets WHERE schedule_widget_id NOT IN( SELECT id FROM schedule_widgets);
DELETE FROM playlist_relations WHERE playlist_id NOT IN( SELECT id FROM playlists);
DELETE FROM playlist_relations WHERE episode_id NOT IN( SELECT id FROM episodes);
DELETE FROM playlist_relations WHERE program_id NOT IN( SELECT id FROM programs);
DELETE FROM posts WHERE group_id NOT IN( SELECT id FROM groups);
DELETE FROM comments WHERE post_id NOT IN( SELECT id FROM posts);
DELETE FROM documents WHERE post_id NOT IN( SELECT id FROM posts);
DELETE FROM programs_topics WHERE program_id NOT IN( SELECT id FROM programs);
DELETE FROM programs_topics WHERE topic_id NOT IN( SELECT id FROM topics);
DELETE FROM programs_users WHERE program_id NOT IN( SELECT id FROM programs);
DELETE FROM schedules WHERE live_video_id NOT IN( SELECT id FROM live_videos);
DELETE FROM tag_relations WHERE episode_id NOT IN( SELECT id FROM episodes);
DELETE FROM episodes WHERE episode_origin_option_id NOT IN( SELECT id FROM episode_origin_options);
DELETE FROM documents WHERE episode_id NOT IN( SELECT id FROM episodes);
DELETE FROM documents WHERE program_id NOT IN( SELECT id FROM programs);
DELETE FROM episodes WHERE program_id NOT IN( SELECT id FROM programs);
DELETE FROM episodes_topics WHERE episode_id NOT IN( SELECT id FROM episodes);
DELETE FROM episodes_users WHERE episode_id NOT IN( SELECT id FROM episodes);
DELETE FROM external_links WHERE program_id NOT IN( SELECT id FROM programs);
DELETE FROM live_video_episodes WHERE schedule_id NOT IN( SELECT id FROM schedules);
DELETE FROM live_video_widgets_videos WHERE live_video_id NOT IN( SELECT id FROM live_videos);
DELETE FROM live_video_widgets_videos WHERE live_video_widget_id NOT IN( SELECT id FROM live_video_widgets);
DELETE FROM podcast_episodes WHERE podcast_id NOT IN( SELECT id FROM podcasts);
DELETE FROM podcast_widgets_podcasts WHERE podcast_id NOT IN( SELECT id FROM podcasts);
DELETE FROM tag_relations WHERE episode_id NOT IN( SELECT id FROM episodes);


-- Reset the index of primary key
DO $$ 
DECLARE 
    table_names text[];
BEGIN
    table_names := ARRAY[
        'cablecast_integrations', 'change_email_requests', 'comments', 'directus_activity', 'directus_fields', 
        'directus_notifications', 'directus_permissions', 'directus_presets', 'directus_relations', 'directus_revisions',
        'documents', 'donation_settings', 'donations', 'episode_origin_options', 'episode_settings', 'episodes',
        'episodes_topics', 'episodes_users', 'external_links', 'group_tags', 'group_tags_groups', 'groups', 'groups_users',
        'images', 'invites', 'live_video_episodes', 'live_videos', 'mail_chimp_integrations', 'organization_settings',
        'organizations', 'playlist_relations', 'playlists', 'podcast_episodes', 'podcasts', 'posts', 'producer_settings',
        'program_settings', 'program_settings_types', 'program_types', 'programs_topics', 'programs_users', 'radios',
        'rentle_integrations', 'schedules', 'social_media_links', 'stripe_integrations', 'tag_relations', 'tags',
        'telvue_integrations', 'topics', 'topics_relation_settings', 'vimeo_integrations', 'webflow_integrations'
    ];

    FOR i IN array_lower(table_names, 1) .. array_upper(table_names, 1)
    LOOP
        EXECUTE 'SELECT setval(''' || table_names[i] || '_id_seq'', (SELECT id FROM ' || table_names[i] || ' ORDER BY id DESC LIMIT 1), true) LIMIT 100';
    END LOOP;
END $$;