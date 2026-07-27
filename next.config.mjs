/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Permet de générer des fichiers HTML/CSS/JS statiques
  images: {
    unoptimized: true, // Requis par Next.js pour l'export statique des images
  },
};

export default nextConfig;