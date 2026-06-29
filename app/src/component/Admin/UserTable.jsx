export default function UserTable({ usersList, updateUserRole }) {
  return (
    <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
      <h2 className="text-xl font-bold text-amber-500 mb-6">Gestion des Accès</h2>
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-950 text-neutral-400">
          <tr><th className="p-3">Email</th><th className="p-3">Rôle</th><th className="p-3">Action</th></tr>
        </thead>
        <tbody>
          {usersList.map((u) => (
            <tr key={u.id} className="border-b border-neutral-800">
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">
                <select value={u.role} onChange={(e) => updateUserRole(u.id, e.target.value)} className="bg-neutral-950 p-1 rounded">
                  <option value="inconnu">Inconnu</option><option value="user">User</option><option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}