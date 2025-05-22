"use client";

import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const BookPage = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageTransition, setPageTransition] = React.useState('');
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const speechSynthesisRef = React.useRef<SpeechSynthesis | null>(null);
  
  // Removed mouse position tracking as requested

  // Add keyboard event listener for arrow key navigation and disable copy/paste
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleNextPage();
      } else if (e.key === 'ArrowRight') {
        handlePreviousPage();
      }
      
      // Disable copy/paste keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        return false;
      }
    };
    
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    // Disable selection
    const disableSelection = () => {
      return false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', disableSelection);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', disableSelection);
    };
  }, [currentPage]);
  
  // Initialize speech synthesis
  React.useEffect(() => {
    // Check if the browser supports speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
    
    // Clean up function to stop speaking when component unmounts
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);
  
  // Stop speaking when changing pages
  React.useEffect(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [currentPage]);
  
  // Mouse movement tracking removed as requested
  
  const bookContent = [
    {
      subtitle: "🧭 Chapitre 1 – Qu'est-ce que la Médina ?",
      image: "/images/1.jpg",
      content: [
        "La Médina de Tunis est un endroit magique, plein de secrets, de sons, de couleurs et d'odeurs. C'est le vieux cœur de la ville de Tunis, un quartier très ancien fondé au 7ᵉ siècle. Elle est comme une petite ville dans la grande ville : entourée de murs, remplie de ruelles étroites, de maisons blanches, de grandes portes et de lieux incroyables.",
        "Quand on entre dans la Médina, on a l'impression de voyager dans le temps. Ici, pas de voitures bruyantes, mais des gens qui marchent, discutent, achètent des objets traditionnels ou boivent du thé à la menthe. En 1979, la Médina a été reconnue patrimoine mondial de l'UNESCO, car elle est très précieuse pour l'histoire de la Tunisie et du monde."
      ]
    },
    {
      subtitle: "🕌 Chapitre 2 – Les monuments incroyables de la Médina",
      image: "/images/2.jpg",
      content: [
        "Dans la Médina, on trouve des monuments magnifiques construits il y a des centaines d'années.",
        "Le plus célèbre est la Mosquée Zitouna, la plus grande et la plus ancienne mosquée de Tunis. Elle a un grand minaret carré et une grande cour avec une fontaine où les fidèles font leurs ablutions avant la prière.",
        "Il y a aussi de grands palais appelés Dar, comme Dar Lasram, Dar Hussein ou Dar Ben Abdallah. Ces maisons ont des portes sculptées, des patios fleuris, des mosaïques colorées et des plafonds décorés.",
        "Un autre lieu spécial est le Tourbet El Bey, un mausolée où sont enterrés les anciens dirigeants de Tunis. À l'intérieur, tout est décoré de marbre, de bois sculpté et de céramiques.",
        "Et bien sûr, il y a les souks, des marchés traditionnels comme le Souk El Attarine (où l'on vend des parfums et des épices) ou le Souk El Blaghgia (pour acheter des babouches faites main). C'est là que la vie de la Médina bat son plein !"
      ]
    },
    {
      subtitle: "👗 Chapitre 3 – Les habits traditionnels tunisiens",
      image: "/images/3.jpg",
      content: [
        "Les vêtements que les gens portent dans la Médina, surtout pendant les fêtes ou les mariages, sont très différents des habits modernes.",
        "Les hommes portent souvent une jebba, une longue tunique brodée, accompagnée d'un pantalon traditionnel et d'un bonnet rouge appelé chéchia. Aux pieds, ils portent des babouches.",
        "Les femmes, elles, sont comme des princesses ! Elles portent la fouta et blouza, ou parfois la keswa el kbira pendant les mariages, un habit très riche en broderies et en bijoux. Elles aiment porter des colliers anciens, des bracelets et des boucles d'oreilles en or.",
        "Ces habits ne servent pas seulement à s'habiller. Ils racontent une histoire, une culture, une identité."
      ]
    },
    {
      subtitle: "🍽️ Chapitre 4 – La nourriture de la Médina",
      image: "/images/11.jpg",
      content: [
        "Mmmh… Ça sent bon dans la Médina ! La cuisine tunisienne est pleine de goût et de couleurs.",
        "Le couscous est le plat le plus connu. Il est fait de semoule cuite à la vapeur, servie avec des légumes, de la viande ou du poisson. Chaque famille a sa recette secrète !",
        "On mange aussi la brik à l'œuf, une fine feuille croustillante appelée malsouka, pliée avec un œuf, du thon et du persil, puis frite dans de l'huile bien chaude. Un vrai régal !",
        "Et les pâtisseries ? Les tunisiens adorent les baklawas, les makrouds et les samsas, souvent préparés avec du miel, des amandes ou des dattes. Ces douceurs sont souvent accompagnées d'un café turc ou d'un thé à la menthe bien sucré."
      ]
    }
  ];

  const totalPages = bookContent.length;

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setPageTransition('slide-right');
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setPageTransition('');
      }, 300);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      // Stop speaking when changing pages
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        setIsSpeaking(false);
      }
      
      setPageTransition('slide-left');
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setPageTransition('');
      }, 300);
    }
  };
  
  // Function to read the current chapter content
  const readChapterContent = () => {
    if (!speechSynthesisRef.current) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }
    
    // If already speaking, stop
    if (isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      return;
    }
    
    // Get all text content from the current chapter
    const textToRead = bookContent[currentPage].subtitle + '. ' + 
                       bookContent[currentPage].content.join('. ');
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Set language to French
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9; // Slightly slower rate for better comprehension
    
    // Event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Start speaking
    speechSynthesisRef.current.speak(utterance);
  };

  // CSS for page transitions
  const pageTransitionStyles = {
    position: 'relative',
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    transform: pageTransition === 'slide-left' ? 'translateX(-10%)' : 
               pageTransition === 'slide-right' ? 'translateX(10%)' : 'translateX(0)',
    opacity: pageTransition ? '0.5' : '1',
  } as React.CSSProperties;

  // CSS to disable selection and copying
  const noCopyStyles = {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  } as React.CSSProperties;

  // Edge hover indicators removed as requested

  return (
    <div className="w-full max-w-4xl" style={noCopyStyles}>
      {/* Edge hover zones removed as requested */}
        {/* Book container */}
        <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden flex">
          {/* Left page (book cover or previous content) */}
          <div className="hidden md:block w-1/2 bg-[#E6C17A] p-8">
            <div className="h-full flex flex-col justify-center items-center text-center">
              <h1 className="text-[#C76C4E] text-3xl font-bold mb-4">La Médina de Tunis</h1>
              <p className="text-[#4B5E3D] text-lg">Un voyage à travers l'histoire et la culture tunisienne</p>
              <div className="mt-8">
                <span className="text-[#FFD93D] font-semibold">Médina de Tunis</span>
              </div>
            </div>
          </div>

          {/* Right page (current content) */}
          <div className="w-full md:w-1/2 bg-white p-6 md:p-8 min-h-[600px]">
            <div className="h-full flex flex-col" style={pageTransitionStyles}>
              {/* Page content */}
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[#4B5E3D] text-xl font-semibold">{bookContent[currentPage].subtitle}</h2>
                  <button
                    onClick={readChapterContent}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${isSpeaking ? 'bg-[#C76C4E] text-white' : 'bg-[#E6C17A] text-[#4B5E3D] hover:bg-[#C76C4E] hover:text-white'}`}
                    aria-label={isSpeaking ? 'Arrêter la lecture' : 'Lire à haute voix'}
                  >
                    {isSpeaking ? (
                      <>
                        <span className="animate-pulse">●</span> Arrêter
                      </>
                    ) : (
                      <>
                        <span>♪</span> Lire
                      </>
                    )}
                  </button>
                </div>
                
                <div className="mb-6 rounded-lg overflow-hidden shadow-md relative h-48 md:h-64">
                  <Image 
                    src={bookContent[currentPage].image} 
                    alt={`Illustration pour ${bookContent[currentPage].subtitle}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
                
                <div className="space-y-4">
                  {bookContent[currentPage].content.map((paragraph, index) => (
                    <p key={index} className="text-gray-800 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Page navigation */}
              <div className="mt-8 flex justify-between items-center">
                <button 
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className={`flex items-center text-[#4B5E3D] ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#C76C4E]'}`}
                >
                  <ChevronLeft className="mr-1" size={20} />
                  <span>Page précédente</span>
                </button>
                <span className="text-[#E6C17A] font-medium">
                  Page {currentPage + 1} sur {totalPages}
                </span>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`flex items-center text-[#4B5E3D] ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#C76C4E]'}`}
                >
                  <span>Page suivante</span>
                  <ChevronRight className="ml-1" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page turn effect (decorative) */}
        <div className="w-full max-w-4xl mt-4 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full ${
                  currentPage === index ? 'bg-[#C76C4E]' : 'bg-[#E6C17A]'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
  );
};

export default BookPage;
