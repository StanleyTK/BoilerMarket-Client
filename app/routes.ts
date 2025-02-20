import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./components/MainLayout.tsx", [
    index("feed/feed.tsx"),
    route("login", "./login/login.tsx"),
    route("register", "./register/register.tsx"),
    route("settings", "./settings/settings.tsx"),
    route("u/:uid", "./user/[uid].tsx"),
    route("u/:uid/edit", "./edit/edit.tsx"),
  ]),
] satisfies RouteConfig;
