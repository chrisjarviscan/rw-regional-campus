
-- 1. chat_conversations: remove public read/update, keep insert (the edge function uses service_role for everything)
DROP POLICY IF EXISTS "Anyone can read conversation by id" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can update own conversation" ON public.chat_conversations;

-- 2. chat_messages: remove public read; keep insert (edge function uses service_role)
DROP POLICY IF EXISTS "Anyone can read messages" ON public.chat_messages;

-- 3. app_settings: restrict writes to service_role only
DROP POLICY IF EXISTS "Authenticated can write settings" ON public.app_settings;
CREATE POLICY "Service role can write settings"
ON public.app_settings
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4. Revoke execute on email queue helpers from anon/authenticated; pin search_path
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
