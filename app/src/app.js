"use client";

import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from "./lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, collection, query, where, updateDoc, addDoc } from "firebase/firestore";

import LoginScreen from "./component/Auth/LoginScreen";
import SearchBar from "./component/Search/SearchBar";
import ItemCard from "./component/Search/ItemCard";
import ItemModal from "./component/Search/ItemModal";
import AddItemForm from "./component/Admin/AddItemForm";
import UserTable from "./component/Admin/UserTable";

export default function SupernaturalApp() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [activeMenu, setActiveMenu] = useState('recherche'); 
  
  const [addTab, setAddTab] = useState('monstres');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nom: '', description: '', niveauAcces: 'tous', imageUrl: '' });
  
  const [searchTab, setSearchTab] = useState('monstres');
  const [searchTerm, setSearchTerm] = useState('');
  const [allData, setAllData] = useState([]); 
  const [searchResults, setSearchResults] = useState([]); 
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [usersList, setUsersList] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- VARIABLE MAGIQUE POUR LE THÈME ---
  const isFBI = searchTab === 'personnages';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          await setDoc(userDocRef, { email: currentUser.email, role: 'inconnu', dateInscription: new Date() });
          setUserRole('inconnu');
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setMessage("Erreur de connexion : " + error.message);
    }
    setLoading(false);
  };

  const handleLogout = () => signOut(auth);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      let allowedAccess = ['tous'];
      if (userRole === 'user') allowedAccess = ['tous', 'inities'];
      if (userRole === 'admin') allowedAccess = ['tous', 'inities', 'admin'];

      const q = query(collection(db, searchTab), where("niveauAcces", "in", allowedAccess));
      const querySnapshot = await getDocs(q);
      let results = [];
      querySnapshot.forEach((doc) => { results.push({ id: doc.id, ...doc.data() }); });
      setAllData(results); 
    } catch (error) {
      console.error("Erreur de récupération:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userRole === 'user' || userRole === 'admin') {
      fetchAllData();
      setSearchTerm(''); 
    }
  }, [searchTab, userRole]);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults(allData); 
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = allData.filter(item => 
        item.nom.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, allData]);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setAddTab(searchTab);
    setFormData({ nom: item.nom, description: item.description, niveauAcces: item.niveauAcces, imageUrl: item.imageUrl || '' });
    setActiveMenu('ajout');
    setMessage('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ nom: '', description: '', niveauAcces: 'tous', imageUrl: '' });
    setMessage('');
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const q = query(collection(db, addTab), where("nom", "==", formData.nom));
      const querySnapshot = await getDocs(q);
      let isDuplicate = false;
      querySnapshot.forEach((doc) => { if (doc.id !== editingId) isDuplicate = true; });

      if (isDuplicate) {
        setMessage(`Erreur : Le nom "${formData.nom}" existe déjà.`);
        setLoading(false);
        return; 
      }

      const payload = { nom: formData.nom, description: formData.description, niveauAcces: formData.niveauAcces, imageUrl: formData.imageUrl };

      if (editingId) {
        await updateDoc(doc(db, addTab, editingId), payload);
        setMessage(`${formData.nom} a été modifié avec succès !`);
      } else {
        payload.auteurEmail = user.email;
        payload.dateCreation = new Date();
        await addDoc(collection(db, addTab), payload);
        setMessage(`${formData.nom} a été ajouté avec succès !`);
      }

      setFormData({ nom: '', description: '', niveauAcces: 'tous', imageUrl: '' });
      setEditingId(null);
      if (activeMenu === 'ajout') fetchAllData(); 
      
    } catch (error) {
      setMessage("Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const usersData = [];
    snapshot.forEach((doc) => usersData.push({ id: doc.id, ...doc.data() }));
    setUsersList(usersData);
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  useEffect(() => {
    if (activeMenu === 'utilisateurs' && userRole === 'admin') fetchUsers();
  }, [activeMenu, userRole]);

  if (!user) return <LoginScreen handleGoogleLogin={handleGoogleLogin} loading={loading} message={message} />;

  // --- DÉFINITION DE L'ARRIÈRE-PLAN SELON LE THÈME ---
  // On utilise un dégradé radial pour simuler l'ambiance sans avoir besoin d'images externes pour l'instant
  const themeBg = isFBI 
    ? "bg-[#050b14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a192f] via-[#050b14] to-black text-cyan-50 font-sans" 
    : "bg-[#1a1311] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3a2218] via-[#1a1311] to-[#0a0705] text-amber-50 font-serif";

  return (
    <div className={`min-h-screen relative transition-colors duration-700 ${themeBg}`}>
      
      {/* NAVBAR */}
      <header className={`border-b p-4 sticky top-0 z-10 shadow-md backdrop-blur-md transition-colors duration-700 ${isFBI ? 'bg-[#0a192f]/80 border-cyan-900/50' : 'bg-[#2a1711]/80 border-amber-900/50'}`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className={`text-xl font-bold tracking-wider ${isFBI ? 'text-cyan-400 font-mono uppercase' : 'text-amber-500 font-serif'}`}>
            {isFBI ? 'FBI :: S.N. DATABASE' : 'Archives Surnaturelles'}
          </h1>
          <div className="flex gap-4 items-center">
            {/* Boutons Navbar (On garde un style neutre ou légèrement teinté) */}
            {(userRole === 'admin' || userRole === 'user') && (
              <button onClick={() => { setActiveMenu('recherche'); handleCancelEdit(); setMessage(''); }} className={`text-sm px-3 py-1 rounded transition-colors ${activeMenu === 'recherche' ? (isFBI ? 'bg-cyan-700 text-white' : 'bg-amber-700 text-white') : 'text-neutral-400 hover:text-white'}`}>
                Recherche
              </button>
            )}
            {userRole === 'admin' && (
              <>
                <button onClick={() => { setActiveMenu('ajout'); handleCancelEdit(); setMessage(''); }} className={`text-sm px-3 py-1 rounded transition-colors ${activeMenu === 'ajout' ? (isFBI ? 'bg-cyan-700 text-white' : 'bg-amber-700 text-white') : 'text-neutral-400 hover:text-white'}`}>
                  Ajouter Fiche
                </button>
                <button onClick={() => { setActiveMenu('utilisateurs'); setMessage(''); }} className={`text-sm px-3 py-1 rounded transition-colors ${activeMenu === 'utilisateurs' ? (isFBI ? 'bg-cyan-700 text-white' : 'bg-amber-700 text-white') : 'text-neutral-400 hover:text-white'}`}>
                  Gérer Chasseurs
                </button>
              </>
            )}
            <span className="text-xs text-neutral-400 border-l border-neutral-700 pl-4 hidden md:inline">{user.email}</span>
            <button onClick={handleLogout} className="text-xs bg-red-900/50 hover:bg-red-800 text-white px-3 py-1 rounded transition-colors">Quitter</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {userRole === 'inconnu' && (
          <div className="bg-black/50 border border-red-900/50 p-10 rounded-lg text-center mt-10 shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl text-red-500 mb-4 font-mono uppercase tracking-widest">Accès Refusé</h2>
            <p className="text-neutral-400">Ton accès n'a pas encore été vérifié. Un administrateur doit valider ton compte.</p>
          </div>
        )}

        {(userRole === 'user' || userRole === 'admin') && activeMenu === 'recherche' && (
          <div className="space-y-6">
            
            {/* ONGLETS DE SÉLECTION DU THÈME */}
            <div className={`flex gap-4 border-b pb-2 transition-colors duration-700 ${isFBI ? 'border-cyan-900/50' : 'border-amber-900/50'}`}>
              <button 
                onClick={() => setSearchTab('monstres')} 
                className={`pb-2 px-4 transition-all duration-300 font-serif text-lg ${searchTab === 'monstres' ? 'text-amber-500 border-b-2 border-amber-500 text-shadow-sm' : 'text-neutral-500 hover:text-amber-700/50'}`}
              >
                Grimoires
              </button>
              <button 
                onClick={() => setSearchTab('personnages')} 
                className={`pb-2 px-4 transition-all duration-300 font-mono uppercase tracking-wider ${searchTab === 'personnages' ? 'text-cyan-400 border-b-2 border-cyan-400 shadow-cyan-400/50' : 'text-neutral-500 hover:text-cyan-700/50'}`}
              >
                Base ADN FBI
              </button>
            </div>

            <div className="flex gap-2">
              <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                placeholder={isFBI ? 'SEARCH_DATABASE_...' : 'Chercher dans les vieux écrits...'} 
                isFBI={isFBI} // On passe l'info du thème !
              />
            </div>

            {loading ? (
              <p className={`italic animate-pulse ${isFBI ? 'text-cyan-600 font-mono' : 'text-amber-700 font-serif'}`}>
                {isFBI ? '> QUERYING DATABASE...' : 'Dépoussiérage des archives en cours...'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {searchResults.length === 0 ? (
                  <p className="text-neutral-500 col-span-full">{isFBI ? 'NO MATCH FOUND IN DATABASE.' : 'Aucune trace de cela dans nos grimoires.'}</p>
                ) : (
                  searchResults.map((item) => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      userRole={userRole} 
                      onClick={() => setSelectedItem(item)} 
                      onEdit={handleEditClick} 
                      isFBI={isFBI} // On passe l'info du thème !
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {userRole === 'admin' && activeMenu === 'ajout' && (
          <AddItemForm formData={formData} setFormData={setFormData} handleSubmitForm={handleSubmitForm} editingId={editingId} handleCancelEdit={handleCancelEdit} loading={loading} addTab={addTab} setAddTab={setAddTab} message={message} />
        )}

        {userRole === 'admin' && activeMenu === 'utilisateurs' && (
          <UserTable usersList={usersList} updateUserRole={updateUserRole} />
        )}
      </main>

      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} isFBI={isFBI} />
    </div>
  );
}