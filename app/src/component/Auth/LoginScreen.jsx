export default function LoginScreen({ handleGoogleLogin, loading, message }) {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-amber-600 mb-2">Journal du Chasseur</h1>
        {message && <p className="text-red-400 mb-4">{message}</p>}
        <button onClick={handleGoogleLogin} disabled={loading} className="bg-white text-black font-bold py-3 px-4 rounded">
          {loading ? 'Vérification...' : 'Continuer avec Google'}
        </button>
      </div>
    </div>
  );
}