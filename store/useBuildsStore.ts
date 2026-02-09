import { create } from 'zustand';
import { Build } from '@/models';
import { safeLocalStorageGet, safeLocalStorageSet } from '@/lib/storage';

const BUILDS_STORAGE_KEY = 'architect-game-builds';

interface BuildsStore {
  builds: Build[];
  addBuild: (build: Build) => void;
  removeBuild: (id: string) => void;
  loadBuilds: () => void;
  saveBuilds: () => void;
}

export const useBuildsStore = create<BuildsStore>((set, get) => ({
  // Initial state
  builds: [],
  
  // Add a new build
  addBuild: (build) => set((state) => {
    const newBuilds = [...state.builds, build];
    safeLocalStorageSet(BUILDS_STORAGE_KEY, newBuilds);
    return { builds: newBuilds };
  }),
  
  // Remove a build by ID
  removeBuild: (id) => set((state) => {
    const newBuilds = state.builds.filter(build => build.id !== id);
    safeLocalStorageSet(BUILDS_STORAGE_KEY, newBuilds);
    return { builds: newBuilds };
  }),
  
  // Load builds from localStorage
  loadBuilds: () => {
    const storedBuilds = safeLocalStorageGet<Build[]>(BUILDS_STORAGE_KEY, []);
    
    // Convert date strings back to Date objects
    const builds = storedBuilds.map(build => ({
      ...build,
      savedAt: new Date(build.savedAt),
      architecture: {
        ...build.architecture,
        createdAt: new Date(build.architecture.createdAt),
        updatedAt: new Date(build.architecture.updatedAt)
      }
    }));
    
    set({ builds });
  },
  
  // Save current builds to localStorage
  saveBuilds: () => {
    const { builds } = get();
    safeLocalStorageSet(BUILDS_STORAGE_KEY, builds);
  }
}));
