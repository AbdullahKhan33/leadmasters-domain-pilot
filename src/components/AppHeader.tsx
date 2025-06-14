
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import Icon from "./Icon";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Flows", href: "#" },
  { title: "Campaigns", href: "#" },
  { title: "Copilot", href: "#" },
  { title: "Email Setup", href: "/" },
];

export function AppHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Rocket" className="text-primary-foreground" size={20}/>
            </div>
            <span className="font-bold sm:inline-block">LeadMasters</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <Link to={item.href}>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), location.pathname === item.href ? "bg-accent" : "")}>
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
