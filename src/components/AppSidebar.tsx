
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Icon from "./Icon";

const menuItems = [
  { title: "Flows", icon: "VenetianMask", href: "#" },
  { title: "Campaigns", icon: "Rocket", href: "#" },
  { title: "Copilot", icon: "Bot", href: "#" },
  { title: "Email Setup", icon: "Mail", href: "/", isActive: true },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Rocket" className="text-primary-foreground" size={20}/>
            </div>
            <h1 className="text-lg font-semibold text-slate-800">LeadMasters</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.href}>
                      <Icon name={item.icon as keyof typeof import('lucide-react').icons} className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
