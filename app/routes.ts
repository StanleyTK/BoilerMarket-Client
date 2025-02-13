import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./components/MainLayout.tsx", [
    index("home/home.tsx"),
    route("login", "./login/login.tsx"),
    route("register", "./register/register.tsx"),
    route("settings", "./settings/settings.tsx"),     
    route("profile", "./profile/profile.tsx"),  
  ]),
] satisfies RouteConfig;
