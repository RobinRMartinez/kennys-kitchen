import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLo4407sFfn_2Z0kPZkkVhbxWMsnBHojI",
  authDomain: "family-recipes-d806b.firebaseapp.com",
  projectId: "family-recipes-d806b",
  storageBucket: "family-recipes-d806b.firebasestorage.app",
  messagingSenderId: "414178100842",
  appId: "1:414178100842:web:b81b37d34aca93a881ec13"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Drinks", "Other"];
const FOOD_EMOJIS = [
  // Mains
  "🍗","🥩","🍕","🍔","🌮","🍜","🍣","🥘","🍲","🫕","🫔",
  // Lighter meals & sides
  "🥗","🥙","🍱","🧆","🧀","🥚","🥨","🫓",
  // Breakfast
  "🥞",
  // Desserts
  "🍰","🧁","🍩","🍪","🥧",
  // Drinks
  "🍷","☕","🍵","🥤","🫙"
];

function RecipeCard({ recipe, onClick }) {
  return (
    <div
      onClick={() => onClick(recipe)}
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,200,100,0.2)",
        borderRadius: "18px",
        padding: "22px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
        e.currentTarget.style.borderColor = "rgba(255,180,60,0.5)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        e.currentTarget.style.borderColor = "rgba(255,200,100,0.2)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: "radial-gradient(circle at top right, rgba(255,160,40,0.15), transparent 70%)", borderRadius: "0 18px 0 0" }} />
      <div style={{ fontSize: "36px", marginBottom: "10px" }}>{recipe.emoji || "🍽️"}</div>
      <div style={{
        fontSize: "10px", color: "#f0a030", fontWeight: "700",
        letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "6px",
        fontFamily: "'Courier New', monospace"
      }}>{recipe.category}</div>
      <div style={{
        fontSize: "17px", fontWeight: "700", color: "#fdf0d5",
        marginBottom: "8px", lineHeight: "1.3",
        fontFamily: "'Georgia', serif"
      }}>{recipe.title}</div>
      <div style={{ fontSize: "12px", color: "rgba(255,200,120,0.7)", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
        by {recipe.author}
      </div>
      {recipe.note && (
        <div style={{
          marginTop: "10px", fontSize: "12px", color: "rgba(253,240,213,0.6)",
          lineHeight: "1.5", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          fontFamily: "Georgia, serif", fontStyle: "italic"
        }}>{recipe.note}</div>
      )}
    </div>
  );
}

function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(10,6,3,0.85)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", backdropFilter: "blur(8px)"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "linear-gradient(160deg, #1e1208 0%, #160e06 100%)",
        border: "1px solid rgba(255,180,60,0.3)",
        borderRadius: "24px", padding: "40px",
        maxWidth: "580px", width: "100%",
        maxHeight: "88vh", overflowY: "auto",
        boxShadow: "0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,200,100,0.1)",
        position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "18px", right: "18px",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "50%", width: "32px", height: "32px",
          fontSize: "16px", cursor: "pointer", color: "#fdf0d5",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>✕</button>
        <div style={{ fontSize: "52px", marginBottom: "14px" }}>{recipe.emoji || "🍽️"}</div>
        <div style={{
          fontSize: "10px", color: "#f0a030", fontWeight: "700",
          letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "8px",
          fontFamily: "'Courier New', monospace"
        }}>{recipe.category}</div>
        <h2 style={{
          fontSize: "28px", fontFamily: "Georgia, serif",
          fontWeight: "700", color: "#fdf0d5", margin: "0 0 8px 0", lineHeight: "1.2"
        }}>{recipe.title}</h2>
        <div style={{ fontSize: "13px", color: "rgba(255,200,120,0.7)", fontStyle: "italic", marginBottom: "24px", fontFamily: "Georgia, serif" }}>
          by {recipe.author}{recipe.date ? ` · ${recipe.date}` : ""}
        </div>
        {recipe.note && (
          <div style={{
            background: "rgba(255,160,40,0.08)",
            border: "1px solid rgba(255,160,40,0.2)",
            borderLeft: "3px solid #f0a030",
            padding: "14px 18px", borderRadius: "0 12px 12px 0",
            fontSize: "14px", color: "rgba(253,240,213,0.8)",
            fontStyle: "italic", marginBottom: "28px",
            lineHeight: "1.7", fontFamily: "Georgia, serif"
          }}>{recipe.note}</div>
        )}
        {recipe.ingredients && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{
              fontSize: "10px", color: "#f0a030", fontWeight: "700",
              letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "14px",
              fontFamily: "'Courier New', monospace"
            }}>Ingredients</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recipe.ingredients.split("\n").filter(Boolean).map((ing, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "12px",
                  fontSize: "14px", color: "#fdf0d5", lineHeight: "1.5",
                  fontFamily: "Georgia, serif"
                }}>
                  <span style={{ color: "#f0a030", marginTop: "3px", flexShrink: 0, fontSize: "8px" }}>◆</span>
                  {ing.trim()}
                </div>
              ))}
            </div>
          </div>
        )}
        {recipe.instructions && (
          <div>
            <div style={{
              fontSize: "10px", color: "#f0a030", fontWeight: "700",
              letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "14px",
              fontFamily: "'Courier New', monospace"
            }}>Instructions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {recipe.instructions.split("\n").filter(Boolean).map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{
                    background: "linear-gradient(135deg, #f0a030, #c97820)",
                    color: "#1a0e04", borderRadius: "50%",
                    width: "26px", height: "26px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "800", flexShrink: 0,
                    fontFamily: "'Courier New', monospace"
                  }}>{i + 1}</div>
                  <div style={{
                    fontSize: "14px", color: "rgba(253,240,213,0.85)",
                    lineHeight: "1.7", fontFamily: "Georgia, serif", paddingTop: "3px"
                  }}>{step.trim()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: "", author: "", category: "Dinner",
    emoji: "🍽️", note: "", ingredients: "", instructions: ""
  });

  useEffect(() => {
    const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!form.title || !form.author) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "recipes"), {
        ...form,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        createdAt: serverTimestamp()
      });
      setForm({ title: "", author: "", category: "Dinner", emoji: "🍽️", note: "", ingredients: "", instructions: "" });
      setSaved(true);
      setTimeout(() => { setSaved(false); setView("home"); }, 1400);
    } catch (err) {
      alert("Error saving recipe. Please try again.");
    }
    setSaving(false);
  };

  const filtered = recipes.filter(r => {
    const matchSearch = r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.author?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || r.category === filterCat;
    return matchSearch && matchCat;
  });

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,180,60,0.25)",
    borderRadius: "12px", fontSize: "14px",
    fontFamily: "Georgia, serif", color: "#fdf0d5",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  const labelStyle = {
    fontSize: "10px", color: "#f0a030", fontWeight: "700",
    letterSpacing: "2.5px", textTransform: "uppercase",
    marginBottom: "7px", display: "block",
    fontFamily: "'Courier New', monospace"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0d0804 0%, #1a0f06 40%, #110a04 100%)",
      fontFamily: "Georgia, serif",
      color: "#fdf0d5"
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 20% 10%, rgba(200,100,20,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 80% 80%, rgba(180,80,10,0.08) 0%, transparent 60%)"
      }} />
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(13,8,4,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,180,60,0.15)",
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ padding: "16px 0" }}>
          <div style={{
            fontSize: "20px", fontWeight: "700", color: "#fdf0d5",
            fontFamily: "Georgia, serif", letterSpacing: "0.3px"
          }}>
            🍳 From Kenny's Kitchen to Ours
          </div>
          <div style={{
            fontSize: "10px", color: "#f0a030", letterSpacing: "2px",
            textTransform: "uppercase", fontFamily: "'Courier New', monospace",
            marginTop: "2px"
          }}>
            {loading ? "Loading..." : `${recipes.length} family recipe${recipes.length !== 1 ? "s" : ""}`}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["home", "add"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "9px 18px", borderRadius: "10px",
              border: "1px solid",
              borderColor: view === v ? "#f0a030" : "rgba(255,180,60,0.2)",
              background: view === v ? "rgba(240,160,48,0.15)" : "transparent",
              color: view === v ? "#f0a030" : "rgba(253,240,213,0.5)",
              fontFamily: "Georgia, serif", fontSize: "13px",
              fontWeight: "700", cursor: "pointer", transition: "all 0.2s"
            }}>
              {v === "home" ? "All Recipes" : "+ Add Recipe"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 20px", position: "relative", zIndex: 1 }}>
        {view === "home" && (
          <>
            <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search recipes or family members..."
                style={{ ...inputStyle, flex: "1", minWidth: "200px" }}
                onFocus={e => e.target.style.borderColor = "rgba(240,160,48,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,180,60,0.25)"}
              />
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                style={{ ...inputStyle, width: "auto", cursor: "pointer" }}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(240,160,48,0.6)" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍳</div>
                <div style={{ fontStyle: "italic" }}>Loading recipes from Kenny's kitchen...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🍽️</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#fdf0d5", marginBottom: "8px" }}>
                  {recipes.length === 0 ? "No recipes yet!" : "No matches found"}
                </div>
                <div style={{ fontSize: "14px", color: "rgba(253,240,213,0.5)", fontStyle: "italic" }}>
                  {recipes.length === 0 ? "Be the first to add a recipe for the family! 👨‍🍳" : "Try a different search or category"}
                </div>
                {recipes.length === 0 && (
                  <button onClick={() => setView("add")} style={{
                    marginTop: "24px", padding: "14px 32px",
                    background: "linear-gradient(135deg, #f0a030, #c97820)",
                    color: "#1a0e04", border: "none", borderRadius: "12px",
                    fontFamily: "Georgia, serif", fontSize: "15px",
                    fontWeight: "700", cursor: "pointer"
                  }}>Add Kenny's First Recipe</button>
                )}
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px"
              }}>
                {filtered.map(r => (
                  <RecipeCard key={r.id} recipe={r} onClick={setSelected} />
                ))}
              </div>
            )}
          </>
        )}

        {view === "add" && (
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,180,60,0.2)",
            borderRadius: "24px", padding: "40px",
            maxWidth: "600px", margin: "0 auto",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>✍️</div>
            <h2 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#fdf0d5", margin: "0 0 4px 0" }}>
              Share a Recipe
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(253,240,213,0.5)", fontStyle: "italic", margin: "0 0 30px 0" }}>
              Add something delicious for the whole family to try!
            </p>
            <div style={{ marginBottom: "22px" }}>
              <label style={labelStyle}>Pick an Emoji</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {FOOD_EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))} style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    border: "1px solid",
                    borderColor: form.emoji === e ? "#f0a030" : "rgba(255,180,60,0.2)",
                    background: form.emoji === e ? "rgba(240,160,48,0.2)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer", fontSize: "20px", transition: "all 0.15s"
                  }}>{e}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Recipe Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Grandma's Enchiladas..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(240,160,48,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,180,60,0.25)"} />
              </div>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                  placeholder="Kenny, Chelsea, Tess..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(240,160,48,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,180,60,0.25)"} />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ ...inputStyle, cursor: "pointer" }}>
                {CATEGORIES.map(c => <option key={c} style={{ background: "#1a0f06" }}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>A Little Note (optional)</label>
              <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="Kenny's go-to after a long day..." style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(240,160,48,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,180,60,0.25)"} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Ingredients (one per line)</label>
              <textarea value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                placeholder={"2 cups flour\n1 tsp salt\n3 eggs..."} rows={5}
                style={{ ...inputStyle, resize: "vertical", lineHeight: "1.7" }}
                onFocus={e => e.target.style.borderColor = "rgba(240,160,48,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,180,60,0.25)"} />
            </div>
            <div style={{ marginBottom: "30px" }}>
              <label style={labelStyle}>Instructions (one step per line)</label>
              <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
                placeholder={"Preheat oven to 350°F\nMix dry ingredients\nAdd wet ingredients and stir..."} rows={6}
                style={{ ...inputStyle, resize: "vertical", lineHeight: "1.7" }}
                onFocus={e => e.target.style.borderColor = "rgba(240,160,48,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,180,60,0.25)"} />
            </div>
            <button onClick={handleAdd} disabled={!form.title || !form.author || saving} style={{
              width: "100%", padding: "17px",
              background: saved
                ? "linear-gradient(135deg, #4caf50, #388e3c)"
                : (form.title && form.author
                  ? "linear-gradient(135deg, #f0a030, #c97820)"
                  : "rgba(255,255,255,0.07)"),
              color: form.title && form.author ? "#1a0e04" : "rgba(253,240,213,0.3)",
              border: "none", borderRadius: "14px",
              fontFamily: "Georgia, serif", fontSize: "16px",
              fontWeight: "700", cursor: form.title && form.author ? "pointer" : "not-allowed",
              transition: "all 0.3s", letterSpacing: "0.5px"
            }}>
              {saved ? "✓ Added to the Family Cookbook!" : saving ? "Saving..." : "Add to Kenny's Kitchen"}
            </button>
          </div>
        )}
      </div>
      <RecipeModal recipe={selected} onClose={() => setSelected(null)} />
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(240,160,48,0.3); border-radius: 3px; }
        option { background: #1a0f06; color: #fdf0d5; }
      `}</style>
    </div>
  );
}