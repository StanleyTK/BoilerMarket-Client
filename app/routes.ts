import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./components/MainLayout.tsx", [
    index("feed/feed.tsx"),
    route("login", "./login/login.tsx"),
    route("l/:lid", "./listing_page/[lid].tsx"),
    route("register", "./register/register.tsx"),
    route("settings", "./settings/settings.tsx"),
    route("u/:uid", "./user/[uid].tsx"),
    route("u/:uid/manage_listings", "./manage_listing/manage_listing.tsx"),
    route("verify/:token", "./user/[token].tsx"),
    route("u/:uid/edit", "./edit_user/edit_user.tsx"),
    route("search", "./search/search.tsx"),
    route("u/:uid/createlisting", "./create_listing/create_listing.tsx"),
    route("about", "./about/about.tsx"),
  ]),
] satisfies RouteConfig;
