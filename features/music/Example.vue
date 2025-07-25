<script setup lang="ts">
import PlusCircledIcon from '~icons/radix-icons/plus-circled'
import { Button } from '@/registry/new-york/ui/button'
import { ScrollArea, ScrollBar } from '@/registry/new-york/ui/scroll-area'
import { Separator } from '@/registry/new-york/ui/separator'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/new-york/ui/tabs'
import AlbumArtwork from './components/AlbumArtwork.vue'
import Menu from './components/Menu.vue'
import PodcastEmptyPlaceholder from './components/PodcastEmptyPlaceholder.vue'
import Sidebar from './components/Sidebar.vue'
import { listenNowAlbums, madeForYouAlbums } from './data/albums'
import { playlists } from './data/playlists'
</script>

<template>
  <div class="md:hidden">
    <VPImage
      alt="Music"
      width="1280"
      height="1214" class="block" :image="{
        dark: '/examples/music-dark.png',
        light: '/examples/music-light.png',
      }"
    />
  </div>
  <div class="hidden md:block">
    <Menu />
    <div class="border-t">
      <div class="bg-background">
        <div class="grid lg:grid-cols-5">
          <Sidebar :playlists="playlists" class="hidden lg:block" />
          <div class="col-span-3 lg:col-span-4 lg:border-l">
            <div class="h-full px-4 py-6 lg:px-8">
              <Tabs default-value="music" class="h-full space-y-6">
                <div class="space-between flex items-center">
                  <TabsList>
                    <TabsTrigger value="music" class="relative">
                      Music
                    </TabsTrigger>
                    <TabsTrigger value="podcasts">
                      Podcasts
                    </TabsTrigger>
                    <TabsTrigger value="live" disabled>
                      Live
                    </TabsTrigger>
                  </TabsList>
                  <div class="ml-auto mr-4">
                    <Button>
                      <PlusCircledIcon class="mr-2 h-4 w-4" />
                      Add music
                    </Button>
                  </div>
                </div>
                <TabsContent
                  value="music"
                  class="border-none p-0 outline-none"
                >
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <h2 class="text-2xl font-semibold tracking-tight">
                        Listen Now
                      </h2>
                      <p class="text-sm text-muted-foreground">
                        Top picks for you. Updated daily.
                      </p>
                    </div>
                  </div>
                  <Separator class="my-4" />
                  <div class="relative">
                    <ScrollArea>
                      <div class="flex space-x-4 pb-4">
                        <AlbumArtwork
                          v-for="album in listenNowAlbums"
                          :key="album.name"
                          :album="album"
                          class="w-[250px]"
                          aspect-ratio="portrait"
                          :width="250"
                          :height="330"
                        />
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div class="mt-6 space-y-1">
                    <h2 class="text-2xl font-semibold tracking-tight">
                      Made for You
                    </h2>
                    <p class="text-sm text-muted-foreground">
                      Your personal playlists. Updated daily.
                    </p>
                  </div>
                  <Separator class="my-4" />
                  <div class="relative">
                    <ScrollArea>
                      <div class="flex space-x-4 pb-4">
                        <AlbumArtwork
                          v-for="album in madeForYouAlbums"
                          :key="album.name"
                          :album="album"
                          class="w-[150px]"
                          aspect-ratio="square"
                          :width="150"
                          :height="150"
                        />
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </TabsContent>
                <TabsContent
                  value="podcasts"
                  class="h-full flex-col border-none p-0 data-[state=active]:flex"
                >
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <h2 class="text-2xl font-semibold tracking-tight">
                        New Episodes
                      </h2>
                      <p class="text-sm text-muted-foreground">
                        Your favorite podcasts. Updated daily.
                      </p>
                    </div>
                  </div>
                  <Separator class="my-4" />
                  <PodcastEmptyPlaceholder />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
