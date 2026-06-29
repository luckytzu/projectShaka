export default function AddItemForm({ formData, setFormData, handleSubmitForm, editingId, handleCancelEdit, loading, addTab, setAddTab, message }) {
  return (
    <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 shadow-lg">
      <div className="flex justify-between mb-6 border-b border-neutral-800 pb-4">
        <h2 className="text-xl font-bold text-amber-500">{editingId ? `Modifier : ${formData.nom}` : 'Créer une nouvelle fiche'}</h2>
        {editingId && <button onClick={handleCancelEdit} className="text-sm text-neutral-400 hover:text-white underline">Annuler</button>}
      </div>
      
      {!editingId && (
        <div className="flex gap-4 mb-6">
          <button type="button" onClick={() => setAddTab('monstres')} className={`px-4 py-2 rounded ${addTab === 'monstres' ? 'bg-neutral-800 text-amber-500' : 'text-neutral-500'}`}>Grimoires</button>
          <button type="button" onClick={() => setAddTab('personnages')} className={`px-4 py-2 rounded ${addTab === 'personnages' ? 'bg-neutral-800 text-amber-500' : 'text-neutral-500'}`}>Base ADN</button>
        </div>
      )}
      
      <form onSubmit={handleSubmitForm} className="space-y-4">
        <input type="text" placeholder="Nom" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded text-white" required />
        
        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded text-white h-32" required />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="url" placeholder="Lien image (ex: https://...)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded text-white" />
          
          <select value={formData.niveauAcces} onChange={e => setFormData({...formData, niveauAcces: e.target.value})} className="w-full p-2 bg-neutral-950 border border-amber-900 rounded text-white outline-none">
            <option value="tous">Tous (Public)</option>
            <option value="inities">Initié (Confirmés)</option>
            <option value="admin">Admin (Top Secret)</option>
          </select>
        </div>

        {/* Affichage du message de succès ou d'erreur */}
        {message && (
          <div className={`p-3 rounded border ${message.includes('Erreur') ? 'bg-red-900/30 border-red-900 text-red-400' : 'bg-green-900/30 border-green-900 text-green-400'}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading} className="bg-amber-700 hover:bg-amber-600 px-6 py-2 rounded font-bold w-full transition-colors">
          {loading ? 'Traitement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}