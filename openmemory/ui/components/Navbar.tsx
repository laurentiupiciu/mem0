"use client";

import { Button } from "@/components/ui/button";
import { HiHome, HiMiniRectangleStack } from "react-icons/hi2";
import { RiApps2AddFill } from "react-icons/ri";
import { FiRefreshCcw } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreateMemoryDialog } from "@/app/memories/components/CreateMemoryDialog";
import { useMemoriesApi } from "@/hooks/useMemoriesApi";
import Image from "next/image";
import { useStats } from "@/hooks/useStats";
import { useAppsApi } from "@/hooks/useAppsApi";
import { Settings } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function Navbar() {
  const pathname = usePathname();
  const userId = useSelector((state: RootState) => state.profile.userId);

  const memoriesApi = useMemoriesApi();
  const appsApi = useAppsApi();
  const statsApi = useStats();
  const configApi = useConfig();

  // Define route matchers with typed parameter extraction
  const routeBasedFetchMapping: {
    match: RegExp;
    getFetchers: (params: Record<string, string>) => (() => Promise<any>)[];
  }[] = [
    {
      match: /^\/([^/]+)\/memory\/([^/]+)$/,
      getFetchers: ({ memory_id }) => [
        () => memoriesApi.fetchMemoryById(memory_id),
        () => memoriesApi.fetchAccessLogs(memory_id),
        () => memoriesApi.fetchRelatedMemories(memory_id),
      ],
    },
    {
      match: /^\/([^/]+)\/apps\/([^/]+)$/,
      getFetchers: ({ app_id }) => [
        () => appsApi.fetchAppMemories(app_id),
        () => appsApi.fetchAppAccessedMemories(app_id),
        () => appsApi.fetchAppDetails(app_id),
      ],
    },
    {
      match: /^\/([^/]+)\/memories$/,
      getFetchers: () => [memoriesApi.fetchMemories],
    },
    {
      match: /^\/([^/]+)\/apps$/,
      getFetchers: () => [appsApi.fetchApps],
    },
    {
      match: /^\/([^/]+)$/,
      getFetchers: () => [statsApi.fetchStats, memoriesApi.fetchMemories],
    },
    {
      match: /^\/([^/]+)\/settings$/,
      getFetchers: () => [configApi.fetchConfig],
    },
    // Legacy routes without userId
    {
      match: /^\/memory\/([^/]+)$/,
      getFetchers: ({ memory_id }) => [
        () => memoriesApi.fetchMemoryById(memory_id),
        () => memoriesApi.fetchAccessLogs(memory_id),
        () => memoriesApi.fetchRelatedMemories(memory_id),
      ],
    },
    {
      match: /^\/apps\/([^/]+)$/,
      getFetchers: ({ app_id }) => [
        () => appsApi.fetchAppMemories(app_id),
        () => appsApi.fetchAppAccessedMemories(app_id),
        () => appsApi.fetchAppDetails(app_id),
      ],
    },
    {
      match: /^\/memories$/,
      getFetchers: () => [memoriesApi.fetchMemories],
    },
    {
      match: /^\/apps$/,
      getFetchers: () => [appsApi.fetchApps],
    },
    {
      match: /^\/$/,
      getFetchers: () => [statsApi.fetchStats, memoriesApi.fetchMemories],
    },
    {
      match: /^\/settings$/,
      getFetchers: () => [configApi.fetchConfig],
    },
  ];

  const getFetchersForPath = (path: string) => {
    for (const route of routeBasedFetchMapping) {
      const match = path.match(route.match);
      if (match) {
        if (route.match.source.includes("memory")) {
          // Handle both new dynamic routes and legacy routes
          const memoryId = match.length > 2 ? match[2] : match[1];
          return route.getFetchers({ memory_id: memoryId });
        }
        if (route.match.source.includes("app")) {
          // Handle both new dynamic routes and legacy routes
          const appId = match.length > 2 ? match[2] : match[1];
          return route.getFetchers({ app_id: appId });
        }
        return route.getFetchers({});
      }
    }
    return [];
  };

  const handleRefresh = async () => {
    const fetchers = getFetchersForPath(pathname);
    await Promise.allSettled(fetchers.map((fn) => fn()));
  };

  const isActive = (href: string) => {
    // Handle both legacy and dynamic routes
    if (href === "/") return pathname === href || pathname === `/${userId}`;
    return pathname.includes(href);
  };

  const activeClass = "bg-zinc-800 text-white border-zinc-600";
  const inactiveClass = "text-zinc-300";

  // Create dynamic href based on userId
  const getDynamicHref = (path: string) => {
    return userId ? `/${userId}${path === "/" ? "" : path}` : path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href={getDynamicHref("/")} className="flex items-center gap-2">
          <Image src="/logo.svg" alt="OpenMemory" width={26} height={26} />
          <span className="text-xl font-medium">OpenMemory</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href={getDynamicHref("/")}>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 border-none ${
                isActive("/") ? activeClass : inactiveClass
              }`}
            >
              <HiHome />
              Dashboard
            </Button>
          </Link>
          <Link href={getDynamicHref("/memories")}>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 border-none ${
                isActive("/memories") ? activeClass : inactiveClass
              }`}
            >
              <HiMiniRectangleStack />
              Memories
            </Button>
          </Link>
          <Link href={getDynamicHref("/apps")}>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 border-none ${
                isActive("/apps") ? activeClass : inactiveClass
              }`}
            >
              <RiApps2AddFill />
              Apps
            </Button>
          </Link>
          <Link href={getDynamicHref("/settings")}>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 border-none ${
                isActive("/settings") ? activeClass : inactiveClass
              }`}
            >
              <Settings />
              Settings
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="border-zinc-700/50 bg-zinc-900 hover:bg-zinc-800"
          >
            <FiRefreshCcw className="transition-transform duration-300 group-hover:rotate-180" />
            Refresh
          </Button>
          <CreateMemoryDialog />
        </div>
      </div>
    </header>
  );
}
