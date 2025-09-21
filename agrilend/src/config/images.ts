// Configuration des images de fond pour la page de connexion
export const backgroundImages = {
  // Image par défaut (vous pouvez remplacer par votre propre image)
  default: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  
  // Autres options d'images que vous pouvez utiliser
  alternatives: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ]
};

// Instructions pour utiliser votre propre image :
// 1. Placez votre image dans le dossier assets/
// 2. Importez-la dans votre composant : import myImage from '../assets/my-image.jpg'
// 3. Utilisez-la dans le style : backgroundImage: `url(${myImage})`
