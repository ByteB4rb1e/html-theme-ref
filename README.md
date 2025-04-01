<a name="tiaras-html-theming-reference"></a>
# Tiara's HTML Theming Reference

> **Heads up**: This is a work-in-progress! Some references may not yet exist,
  but the core ideas are fully in motion.

> I'm rethinking the approach of this project. I was hoping on fostering an
entrypoint for discussions, but I figured I should focus on making this **my**
reference implementation, not **our** reference implementation. Therefore I'm
reworking the documentation as well, so it'll remain spotty for now. 

Welcome to *Tiara's HTML Theming Reference*—a modular, standards-driven approach
to HTML5 theming. This project champions accessibility, frugality, and the
timeless beauty of the UNIX philosophy. Think of it as a launchpad for
developers to explore better, cleaner ways of building scalable, reusable web
themes without vendor lock-in and framework-fatigue.

---

For the time being, here's a UNIX koan yet to be found in the archives.

## Master Foo on web design

A student once asked Master Foo, "What is the greatest sin of web design?"

Master Foo replied, "It is to forget the user."

The student, puzzled, said, “But the overly optimized lazy-loading, awry
infinite scroll and endless cookie banners are greater sins?”

Master Foo shook his head. "The lazy-loading blinds the user, the infinite
scroll disorients them, and the cookie banners drives them away. But these are
merely symptoms. The true sin lies in forgetting that the web is not for the
designer, but for the one who visits."

The student nodded slowly. "And what of those who use divs and JavaScript for
vanity?"

Master Foo smiled. "They are like the baker who builds a cake of sawdust. It may
look impressive, but it is inedible and forgotten by those who hunger."

The student bowed and began to design a page. It had sensible lazy-loading, no
infinite scroll, and an opt-in cookie banner. Its links were clear, its cookies
honest, and its text readable to all.

As the student finished his page, Master Foo said, "Now you understand the Great
Way. Simplicity is not an absence of design but the presence of purpose."

Upon hearing this, the student was enlightened.

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

---

<a name="licensing"></a>
## Licensing

Tiara's HTML Theming Reference is licensed under a Creative Commons Attribution
4.0 International License.

You should have received a copy of the license along with this
work. If not, see <https://creativecommons.org/licenses/by/4.0/>.
