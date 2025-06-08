<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  type SidebarProps,
} from "@/components/ui/sidebar";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  ChevronRight,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-vue-next";

import TeamSwitcher from "~/components/TeamSwitcher.vue";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import data from "~/constants/data";
import sidebar_groups from "~/constants/sidebar_links";

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
  variant: "floating",
});

// This is sample data.

const { isMobile, state, toggleSidebar } = useSidebar();
</script>

<template>
  <ClientOnly>
    <Sidebar v-bind="props">
      <SidebarHeader>
        <TeamSwitcher :teams="data.teams" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup v-for="group in sidebar_groups" :key="group.label">
          <SidebarGroupLabel>{{ group.label }}</SidebarGroupLabel>
          <SidebarMenu v-if="state == 'expanded'">
            <template v-for="item in group.links" :key="item.title">
              <Collapsible
                v-if="item.items"
                as-child
                :default-open="item.isActive"
                class="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton
                      class="cursor-pointer"
                      :tooltip="item.title"
                    >
                      <Icon v-if="item.icon" :name="item.icon" />

                      <span>{{ item.title }}</span>
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem
                        v-for="subItem in item.items"
                        :key="subItem.title"
                      >
                        <SidebarMenuSubButton as-child>
                          <NuxtLink
                            :to="subItem.url"
                            class="flex items-center gap-2"
                            @click="isMobile && toggleSidebar()"
                          >
                            <Icon v-if="subItem.icon" :name="subItem.icon" />
                            <span>{{ subItem.title }}</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuButton
                v-else
                as-child
                class="cursor-pointer"
                :tooltip="item.title"
              >
                <NuxtLink
                  :to="item.url"
                  class="flex items-center gap-2"
                  @click="isMobile && toggleSidebar()"
                >
                  <Icon v-if="item.icon" :name="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </template>
          </SidebarMenu>

          <SidebarMenu v-else>
            <SidebarMenuItem as-child>
              <template v-for="item in group.links" :key="item.title">
                <DropdownMenu v-if="item.items">
                  <DropdownMenuTrigger as-child>
                    <SidebarMenuButton
                      class="cursor-pointer"
                      :tooltip="item.title"
                    >
                      <Icon v-if="item.icon" :name="item.icon" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    class="w-[--reka-dropdown-menu-trigger-width] rounded-lg"
                    :side="isMobile ? 'bottom' : 'right'"
                    align="start"
                    :side-offset="4"
                  >
                    <DropdownMenuLabel>
                      {{ item.title }}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup
                      v-for="subItem in item.items"
                      :key="subItem.title"
                    >
                      <NuxtLink
                        :to="subItem.url"
                        @click="isMobile && toggleSidebar()"
                      >
                        <DropdownMenuItem
                          class="flex cursor-pointer items-center gap-2"
                        >
                          <Icon v-if="subItem.icon" :name="subItem.icon" />

                          {{ subItem.title }}
                        </DropdownMenuItem>
                      </NuxtLink>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <NuxtLink
                  v-else
                  :to="item.url"
                  @click="isMobile && toggleSidebar()"
                >
                  <SidebarMenuButton
                    class="cursor-pointer"
                    :tooltip="item.title"
                  >
                    <Icon v-if="item.icon" :name="item.icon" />
                  </SidebarMenuButton>
                </NuxtLink>
              </template>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage
                      :src="data.user.avatar"
                      :alt="data.user.name"
                    />
                    <AvatarFallback class="rounded-lg"> MD </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-medium">{{
                      data.user.name
                    }}</span>
                    <span class="truncate text-xs">{{ data.user.email }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                :side="isMobile ? 'bottom' : 'right'"
                align="end"
                :side-offset="4"
              >
                <DropdownMenuLabel class="p-0 font-normal">
                  <div
                    class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                  >
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage
                        :src="data.user.avatar"
                        :alt="data.user.name"
                      />
                      <AvatarFallback class="rounded-lg"> MD </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{
                        data.user.name
                      }}</span>
                      <span class="truncate text-xs">{{
                        data.user.email
                      }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  </ClientOnly>
</template>
