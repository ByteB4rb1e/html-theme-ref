<a name="tiaras-html-theming-reference"></a>
# Tiara's HTML Theming Reference

> **Heads up**: This is a work-in-progress! Some references may not yet exist,
  but the core ideas are fully in motion.

Welcome to *Tiara's HTML Theming Reference*—a modular, standards-driven approach
to HTML5 theming. This project champions accessibility, frugality, and the
timeless beauty of the UNIX philosophy. Think of it as a launchpad for
developers to explore better, cleaner ways of building scalable, reusable web
themes without vendor lock-in and framework-fatigue.

> **Why UNIX philosophy?** Because simplicity, modularity, and clarity stand the
  test of time. This reference aims to introduce a younger generation to these
  principles while addressing modern web development challenges.

**What This Is**  
- A reference implementation: flexible, modular, and a discussion starter for
  standards.
- A proof of concept: showcasing matured practices and exploring new methodologies
  for not relying on frameworks.

**What This Is NOT**  
- A plug-and-play framework or service.
- A product with guaranteed updates or support.

**Quick Links**  
- [Architecture Overview](ARCHITECTURE.md)  
- [Contribution Guidelines](CONTRIBUTING.md)  
- [Discussion Board](https://github.com/oxbqkwwxfrqccwtg/html-theme-ref/discussions)  

Check out [Disco Mode](https://www.youtube.com/watch?v=hS-JhioS5Hk) to see how
much fun frugal development can be with little to no technical debt.

---

## Key Principles

1. **Accessibility First (a11y)**  
   Accessibility is non-negotiable. From color systems to workflows, this
   project is designed with inclusion at its core.  

2. **Simplicity is King**
   Adopts SMACSS methodology over BEM for clarity and control, avoiding the
   dreaded “CSS spaghetti.”

3. **CSS Overload, Not Frameworks**  
   No heavy frameworks—just clean, modular CSS and sensible JavaScript.  

4. **Frugal Engineering**  
   Small, efficient, and modular systems to avoid vendor lock-in and promote seamless integrations.  

5. **Collaboration by Design**  
   Engage in discussions, propose standards, and share feedback. Every voice matters.

---

## Goals

- **Standards Compliance**: Strict adherence to W3C and accessibility standards.  
- **Modularity**: Strong separation of concerns for maintainability.  
- **CLI-Driven Builds**: Automation for consistency and reproducibility.  
- **Resource Efficiency**: Designed to thrive in constrained environments.  

For a full breakdown, check the [Goals section in `ARCHITECTURE.md`](ARCHITECTURE.md#goals).

---

## Getting Started

1. **Clone the Repo**

```sh
git clone https://bitbucket.org/tiaracodes/html-theme-ref.git
```

2. **Install dependencies (POSIX-ish shells)**

```sh
sh ./configure
```

2. **Install dependencies (Microsoft PowerShell)**

```powershell
git submodule update --init --remote && npm install
```

3. **Preview and experiment**

```sh
npm run serve:doc
```

Modify `src/` and `docs/` and see real-time changes.

> NOTE: There's currently an issue I'm facing in MinGW with file watching
  through [chokidar](https://github.com/paulmillr/chokidar), defined in
  `webpack.config.doc.js`. I've already opened a
  [bug report](https://github.com/paulmillr/chokidar/issues/1419), but haven't
  verified if the issue also affects other POSIX-ish environments.


4. **Share your thoughts**

Check out [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to get
involved.

---

## Why this matters

This is more than just a reference — it’s a call to arms. Together, we can make
HTML theming more approachable, efficient, and standardized across platforms.
Join me in defending the bastion of frugality, conviction, and simplicity — the
very ideals of the UNIX philosophy.

---

## Let's talk

Head over to the [GitHub discussisons](https://github.com/oxbqkwwxfrqccwtg/html-theme-ref/discussions) to
join the conversation. Feedback, ideas, and critiques are all welcome! Let’s
shape the future of web theming together.

<a name="licensing"></a>
## Licensing

Tiara's HTML Theming Reference is licensed under a Creative Commons Attribution
4.0 International License.

You should have received a copy of the license along with this
work. If not, see <https://creativecommons.org/licenses/by/4.0/>.
