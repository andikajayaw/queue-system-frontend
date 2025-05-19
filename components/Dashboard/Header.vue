<script setup lang="ts">
import sidebar_groups from "~/constants/sidebar_links";

import { Search, Sun, Moon, Check } from "lucide-vue-next";
import { useColorMode, useMagicKeys } from "@vueuse/core";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const mode = useColorMode();

const open = ref(false);

const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) e.preventDefault();
  },
});

watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1]) handleOpenChange();
});

function handleOpenChange() {
  open.value = !open.value;
}
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
  >
    <div class="flex w-full items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1" />
      <Separator
        orientation="vertical"
        class="mr-2 data-[orientation=vertical]:h-4"
      />
      <div class="w-full flex items-center gap-4 justify-between">
        <!-- start here -->

        <div class="w-full max-w-sm cursor-pointer overflow-hidden rounded-md">
          <div
            class="relative flex justify-between w-full items-center hover:bg-slate-500/5 transition-all"
            @click="handleOpenChange"
          >
            <span
              class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
            >
              <Search class="size-5 text-muted-foreground" />
            </span>
            <Input
              id="search"
              type="text"
              placeholder="Search"
              class="px-8 pointer-events-none text-sm w-full"
            />

            <span
              class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
            >
              <kbd
                class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
              >
                <span class="text-xs">⌘</span>K
              </kbd>
            </span>
          </div>
        </div>
        <div>
          <CommandDialog v-model:open="open">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup
                v-for="(group, index) in sidebar_groups"
                :key="group.label"
                :heading="group.label"
              >
                <div v-for="item in group.links" :key="item.title">
                  <NuxtLink
                    v-for="subItem in item.items"
                    :key="subItem.title"
                    :to="subItem.url"
                  >
                    <CommandItem class="cursor-pointer" :value="subItem.title">
                      {{ subItem.title }}
                    </CommandItem>
                  </NuxtLink>
                </div>
                <CommandSeparator
                  v-if="index + 1 < sidebar_groups.length"
                  class="mt-1"
                />
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>

        <!-- End Here -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline">
              <Sun
                class="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              />
              <Moon
                class="w-4 h-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              />

              <span class="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="mode = 'light'">
              <div class="w-full flex items-center justify-between">
                <span> Light </span>
                <Check v-if="mode == 'light'" class="size-4" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'dark'">
              <div class="w-full flex items-center justify-between">
                <span> Dark </span>
                <Check v-if="mode == 'dark'" class="size-4" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'auto'">
              <div class="w-full flex items-center justify-between">
                <span> System </span>
                <Check v-if="mode == 'auto'" class="size-4" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
