import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star } from "lucide-react";
import TemplateCard from "./components/TemplateCard";
import { useAuth } from "../../context/useAuth";
import {
  deleteTemplateRecord,
  duplicateTemplateRecord,
  favoriteTemplateRecord,
  loadUserTemplates,
} from "../../lib/templateLibrary";

const templateTypeOptions = [
  { value: "all", label: "All" },
  { value: "proposal", label: "Proposals" },
  { value: "invitation", label: "Invitations" },
  { value: "email", label: "Emails" },
];

const sortOptions = [
  { value: "recent", label: "Recent" },
  { value: "favorites", label: "Favorites" },
  { value: "name", label: "Name" },
];

const toolRoutes = {
  "proposal-generator": "/templates/proposal-generator",
  "invitation-generator": "/templates/invitation-generator",
  "email-generator": "/templates/email-generator",
};

const formatDate = (value) => {
  if (!value) {
    return "Not yet saved";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function TemplateLibraryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTemplates = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const records = await loadUserTemplates({ ownerId: user.uid, includeArchived: false });
      setTemplates(records);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load templates.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [user]);

  useEffect(() => {
    const handleRefresh = () => loadTemplates();
    window.addEventListener("template-library-updated", handleRefresh);
    return () => window.removeEventListener("template-library-updated", handleRefresh);
  }, [user]);

  const normalizedTemplates = useMemo(() => {
    return templates.map((template) => {
      const updatedAt = template.updatedAt || template.createdAt || null;
      const updatedAtTime = updatedAt ? new Date(updatedAt).getTime() : 0;
      return {
        ...template,
        updatedAtTime,
        updatedAtLabel: formatDate(updatedAt),
      };
    });
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return normalizedTemplates.filter((template) => {
      if (filterType !== "all" && template.templateType !== filterType) {
        return false;
      }

      if (favoritesOnly && !template.favorite) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      return (template.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [normalizedTemplates, filterType, favoritesOnly, searchTerm]);

  const sortedTemplates = useMemo(() => {
    const next = [...filteredTemplates];

    if (sortBy === "favorites") {
      next.sort((a, b) => {
        if (a.favorite !== b.favorite) {
          return a.favorite ? -1 : 1;
        }
        return b.updatedAtTime - a.updatedAtTime;
      });
      return next;
    }

    if (sortBy === "name") {
      next.sort((a, b) => (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" }));
      return next;
    }

    next.sort((a, b) => b.updatedAtTime - a.updatedAtTime);
    return next;
  }, [filteredTemplates, sortBy]);

  const handleDuplicate = async (templateId) => {
    if (!user) {
      return;
    }

    await duplicateTemplateRecord(templateId, user.uid);
    loadTemplates();
  };

  const handleFavorite = async (templateId, favorite) => {
    await favoriteTemplateRecord(templateId, favorite);
    setTemplates((current) =>
      current.map((item) => (item.id === templateId ? { ...item, favorite } : item))
    );
  };

  const handleDelete = async (templateId) => {
    await deleteTemplateRecord(templateId);
    loadTemplates();
  };

  const handleOpen = (template) => {
    const route = toolRoutes[template.toolKey] || "/templates";
    navigate(`${route}?templateId=${template.id}`);
  };

  if (!user) {
    return (
      <section className="premium-panel p-8">
        <p className="premium-kicker">Template library</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Sign in to view your saved templates</h1>
        <p className="mt-3 text-sm text-slate-300">Your template library is private and requires authentication.</p>
        <Link to="/login" className="premium-button-primary mt-6 inline-flex">
          Sign in
        </Link>
      </section>
    );
  }

  const skeletons = Array.from({ length: 6 });

  return (
    <div className="space-y-6">
      <section className="premium-panel p-7 sm:p-10">
        <p className="premium-kicker">Templates / Library</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
          Saved templates and drafts
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">
          Manage every saved proposal, invitation, and email from one visual library.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <Search size={16} />
            <input
              className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {templateTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilterType(option.value)}
                className={
                  filterType === option.value
                    ? "rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900"
                    : "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 hover:text-white"
                }
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFavoritesOnly((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              favoritesOnly ? "border-amber-300/40 bg-amber-300/10 text-amber-100" : "border-white/10 text-slate-300"
            }`}
          >
            <Star size={14} fill={favoritesOnly ? "currentColor" : "none"} />
            Favorites
          </button>

          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            Sort
            <select
              className="bg-transparent text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 outline-none"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-950 text-slate-200">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {errorMessage ? (
        <div className="premium-panel p-6 text-sm text-rose-300">{errorMessage}</div>
      ) : null}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {isLoading
          ? skeletons.map((_, index) => (
              <div key={`skeleton-${index}`} className="premium-panel-strong animate-pulse p-5">
                <div className="h-32 rounded-2xl bg-white/10" />
                <div className="mt-4 h-5 w-24 rounded-full bg-white/10" />
                <div className="mt-4 h-6 w-3/4 rounded bg-white/10" />
                <div className="mt-3 h-4 w-full rounded bg-white/5" />
                <div className="mt-2 h-4 w-2/3 rounded bg-white/5" />
                <div className="mt-6 h-3 w-1/3 rounded bg-white/5" />
              </div>
            ))
          : null}

        {!isLoading && !sortedTemplates.length ? (
          <div className="premium-panel-strong col-span-full flex flex-col items-center gap-5 p-10 text-center">
            <div className="flex h-36 w-full max-w-lg items-center justify-center rounded-3xl border border-dashed border-white/15 bg-gradient-to-br from-white/5 via-white/0 to-white/5">
              <div className="grid gap-3 text-slate-400">
                <div className="h-3 w-48 rounded-full bg-white/10" />
                <div className="h-3 w-32 rounded-full bg-white/10" />
                <div className="h-3 w-40 rounded-full bg-white/10" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">No templates yet</h3>
              <p className="mt-2 text-sm text-slate-300">
                Create your first proposal, invitation, or email to build your library.
              </p>
            </div>
            <Link to="/templates" className="premium-button-primary inline-flex">
              Create your first template
            </Link>
          </div>
        ) : null}

        {!isLoading &&
          sortedTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              isFeatured={index < 2}
              onOpen={() => handleOpen(template)}
              onDuplicate={() => handleDuplicate(template.id)}
              onDelete={() => handleDelete(template.id)}
              onFavorite={() => handleFavorite(template.id, !template.favorite)}
            />
          ))}
      </section>
    </div>
  );
}
