"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FolderOpen,
  Globe2,
  Link2,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

type ResourceType = "Link" | "PDF" | "Drive" | "Repository" | "Video" | "Notes";

interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  category: string;
  url: string;
  favorite: boolean;
}

const initialResources: Resource[] = [
  {
    id: "1",
    name: "College Portal",
    type: "Link",
    category: "College",
    url: "https://www.google.com",
    favorite: true,
  },
  {
    id: "2",
    name: "Semester Notes Drive",
    type: "Drive",
    category: "Notes",
    url: "https://drive.google.com",
    favorite: true,
  },
  {
    id: "3",
    name: "Coding Repositories",
    type: "Repository",
    category: "Coding",
    url: "https://github.com",
    favorite: false,
  },
  {
    id: "4",
    name: "Study Videos",
    type: "Video",
    category: "Learning",
    url: "https://www.youtube.com",
    favorite: false,
  },
];

const typeStyles: Record<ResourceType, string> = {
  Link: "bg-indigo-50 text-indigo-700",
  PDF: "bg-rose-50 text-rose-700",
  Drive: "bg-emerald-50 text-emerald-700",
  Repository: "bg-slate-100 text-slate-700",
  Video: "bg-red-50 text-red-700",
  Notes: "bg-amber-50 text-amber-700",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ResourceType>("Link");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");

  const filteredResources = useMemo(() => {
    const term = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesSearch =
        !term ||
        resource.name.toLowerCase().includes(term) ||
        resource.category.toLowerCase().includes(term) ||
        resource.type.toLowerCase().includes(term);
      return matchesSearch && (!favoritesOnly || resource.favorite);
    });
  }, [favoritesOnly, resources, search]);

  const favoriteCount = resources.filter((resource) => resource.favorite).length;

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !category.trim() || !url.trim()) return;

    const normalizedUrl = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;

    setResources((current) => [
      {
        id: Date.now().toString(),
        name: name.trim(),
        type,
        category: category.trim(),
        url: normalizedUrl,
        favorite: false,
      },
      ...current,
    ]);
    setName("");
    setCategory("");
    setUrl("");
    setType("Link");
  };

  const toggleFavorite = (id: string) => {
    setResources((current) =>
      current.map((resource) =>
        resource.id === id ? { ...resource, favorite: !resource.favorite } : resource
      )
    );
  };

  const removeResource = (id: string) => {
    setResources((current) => current.filter((resource) => resource.id !== id));
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_-30px_rgba(15,23,42,0.45)] sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-100 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 no-underline transition hover:bg-slate-50 hover:text-slate-950"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                <FolderOpen size={15} />
                Quick links & resources
              </div>
              <h2 className="text-2xl font-black tracking-[-0.035em] text-slate-950 sm:text-3xl">
                Everything important, one tap away.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Save college portals, notes, repositories, videos, files, and study links in one searchable place.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:min-w-[250px]">
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xl font-black text-slate-950">{resources.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Saved</p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-3 text-center">
              <p className="text-xl font-black text-violet-700">{favoriteCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-500">Favorites</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Save resource</p>
          <h3 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-slate-950">Add a quick link</h3>
        </div>

        <form onSubmit={handleAdd} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Resource name"
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Category e.g. College"
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://..."
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ResourceType)}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          >
            <option value="Link">Web link</option>
            <option value="PDF">PDF</option>
            <option value="Drive">Drive</option>
            <option value="Repository">Repository</option>
            <option value="Video">Video</option>
            <option value="Notes">Notes</option>
          </select>
          <button
            type="submit"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Save link
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Library</p>
            <h3 className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-slate-950">Saved resources</h3>
          </div>
          <div className="flex gap-2">
            <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:w-64">
              <Search size={16} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search resources"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>
            <button
              onClick={() => setFavoritesOnly((current) => !current)}
              className={`flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold transition ${
                favoritesOnly
                  ? "bg-violet-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Star size={16} fill={favoritesOnly ? "currentColor" : "none"} />
              <span className="hidden sm:inline">Favorites</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <article
              key={resource.id}
              className="group rounded-[22px] border border-slate-200/80 bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_40px_-32px_rgba(15,23,42,0.45)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${typeStyles[resource.type]}`}>
                  {resource.type === "Link" ? <Globe2 size={20} /> : <Link2 size={20} />}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleFavorite(resource.id)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      resource.favorite ? "bg-amber-50 text-amber-500" : "text-slate-300 hover:bg-amber-50 hover:text-amber-500"
                    }`}
                    aria-label={`Favorite ${resource.name}`}
                  >
                    <Star size={17} fill={resource.favorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => removeResource(resource.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove ${resource.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${typeStyles[resource.type]}`}>
                    {resource.type}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    {resource.category}
                  </span>
                </div>
                <h4 className="mt-3 line-clamp-2 text-lg font-extrabold tracking-[-0.02em] text-slate-950">{resource.name}</h4>
              </div>

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-bold text-slate-700 no-underline transition group-hover:bg-slate-950 group-hover:text-white"
              >
                Open resource
                <ExternalLink size={16} />
              </a>
            </article>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <FolderOpen className="mx-auto text-slate-300" size={30} />
            <p className="mt-3 text-sm font-bold text-slate-700">No matching resources</p>
            <p className="mt-1 text-sm text-slate-400">Try another search or save a new link above.</p>
          </div>
        )}
      </section>
    </div>
  );
}
