"use me client"
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, CalendarDays, Clock, Filter, Sparkles } from "lucide-react"
import { type BlogPost, formatPostDate } from "@/lib/blog"

interface BlogFilterSectionProps {
  posts: BlogPost[]
}

export function BlogFilterSection({ posts }: BlogFilterSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const categories = ["All", "Architecture", "Pricing", "Real Estate", "Guide", "Compliance"]

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category.toLowerCase() === selectedCategory.toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [posts, selectedCategory, searchQuery])

  const featured = filteredPosts.find((p) => p.featured) ?? filteredPosts[0]
  const rest = filteredPosts.filter((p) => p.slug !== featured?.slug)

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-6 sm:pt-8 md:pt-10 pb-16 md:pb-24 md:px-6">
      {/* Category Header & Search Row */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        {/* Left Title & Subtitle */}
        <div className="flex-1">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            CATEGORIES
          </span>
          <h2 className="mt-2 text-3xl font-serif font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Browse by categories
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Guides, playbooks, and voice AI deep-dives across 5 topics.
          </p>
        </div>

        {/* Right Live Search Bar */}
        <div className="w-full max-w-md">
          <div className="relative flex items-center rounded-full border border-primary/30 bg-black/40 p-1.5 backdrop-blur-xl shadow-[0_0_25px_rgba(220,38,38,0.12)] transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_35px_rgba(220,38,38,0.25)]">
            <Search className="ml-3.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics..."
              className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mr-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {}}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95 shadow-md shadow-primary/30"
            >
              Search <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Slider / Row */}
      <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
        {categories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase()
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                  : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:border-primary/40 hover:bg-white/[0.06] hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>



      {/* Articles Grid / Empty State */}
      {filteredPosts.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border/70 p-12 text-center">
          <Filter className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">No articles found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No posts match your search for "{searchQuery}". Try searching for another topic or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("All")
            }}
            className="mt-6 rounded-xl bg-primary/10 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/20"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="mt-12 md:mt-14 space-y-8">
          {/* Featured Card (if available) */}
          {featured && (
            <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link
                href={`/blog/${featured.slug}`}
                className="card-glow group grid gap-6 rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md md:grid-cols-[1.4fr_1fr] md:p-8 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary border border-primary/20">
                      {featured.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> {formatPostDate(featured.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {featured.readingMinutes} min read
                    </span>
                  </div>
                  <h3 className="mt-4 text-balance text-2xl font-serif font-normal tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                    {featured.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read full article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                {featured.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.cover}
                    alt={featured.title}
                    className="hidden h-full w-full rounded-xl object-cover ring-1 ring-white/10 md:block"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="hidden rounded-xl bg-[radial-gradient(120%_120%_at_20%_0%,rgba(220,38,38,0.14),transparent_60%)] ring-1 ring-white/10 md:block"
                  />
                )}
              </Link>
            </motion.div>
          )}

          {/* Grid of Remaining Posts */}
          {rest.length > 0 && (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
            >
              <AnimatePresence>
                {rest.map((post) => (
                  <motion.div
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="card-glow group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
                    >
                      {post.cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary border border-primary/20">
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {post.readingMinutes} min
                          </span>
                        </div>
                        <h4 className="mt-4 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {post.title}
                        </h4>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                        <span className="mt-4 text-xs text-muted-foreground">
                          {formatPostDate(post.date)}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}
    </section>
  )
}
