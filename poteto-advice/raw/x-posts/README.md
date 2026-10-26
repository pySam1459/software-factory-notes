# X posts

These are fetched from the X API v2 on 2026-10-26. The fetch ended at 08:25 UTC, which is 08:25 UK time. Times in these files are UTC. UK time was BST (UTC+1) until 01:00 UTC on 25 Oct and GMT (= UTC) after that, so add an hour to anything before 25 Oct. For example, posts from 22 Oct 23:00–23:59 UTC fall on 23 Oct in UK time.

| File | Contents |
|---|---|
| `originals.md` | 148 original and quote posts by @poteto, oldest first, grouped by month. Where she replied under her own post, the reply stays with that post. |
| `replies.md` | 788 replies by @poteto, grouped by day. Each one shows the post she replied to, where the API returned it. |
| `reposts.md` | 51 plain reposts (16–26 Oct only, see gaps). |
| `new-since-2026-10-23.md` | Everything since 23 Oct 00:00 UTC: 100 posts, 87 of them replies. The summary is in `compilation/new-since-2026-10-23.md`. |
| `poteto-posts.json` | Raw JSON for all 989 posts: `posts`, plus `referenced_posts` (the posts she replied to or quoted) and `users` (id to username). |
| `sam-bookmarks.md` / `.json` | Sam's (@samthellm) bookmarks that are poteto's posts or about her advice (6 of the 21 bookmarks). |

## Coverage

- **Posts:** 989 by @poteto (user id 2832427459), from 2026-09-14 03:59 UTC to 2026-10-26 08:25 UTC.
- **22–26 Oct:** user timeline, complete for originals and replies.
- **16–22 Oct:** full-archive search `from:poteto`, complete.
- **14 Sep – 16 Oct, originals:** full-archive search `from:poteto -is:reply -is:retweet`, complete.
- **14 Sep – 16 Oct, replies:** these come from posts gathered in earlier sessions (23–24 Oct), re-fetched by id. They are **probably incomplete**: 5–6 Oct and 9–10 Oct look sparse. Paging the full-archive search back day by day would have cost about 30 more calls.
- **Reposts:** only included from 16 Oct onwards.
- **Long posts:** full text comes from `note_tweet`.
- **Links:** `t.co` links are left as posted. Expanded URLs are listed under each post where the API gave them.
- **Deleted or protected posts** are not returned by the API. Twelve replied-to or quoted posts were not returned.

Posts per day (UTC):

```
09-14:4 09-15:2 09-16:1 09-17:4 09-18:1 09-19:1 09-20:2 09-21:3 09-22:4 09-23:14 09-24:10
09-25:14 09-26:5 09-27:1 09-28:1 09-29:18 09-30:18 10-01:12 10-02:11 10-03:11 10-04:47
10-05:6 10-06:8 10-07:57 10-08:121 10-09:6 10-10:7 10-11:119 10-12:65 10-13:27 10-14:84
10-15:61 10-16:15 10-17:30 10-18:14 10-19:15 10-20:20 10-21:18 10-22:16 10-23:50 10-24:23
10-25:9 10-26:34
```

The material is © its authors. It is copied here for personal reference only.
