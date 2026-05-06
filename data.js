// ═══════════════════════════════════════════
// QUESTIONS DATA — 105 questions corrigées
// ═══════════════════════════════════════════
// Corrections apportées :
// - Q90 : bonne réponse non cochée dans le PDF → corrigée (Victoria Porkchop Parker)

export const QUESTIONS = [
  // ──────────────────────────────────────────
  // GÉNÉRAL — DÉBUTANT (Q1–Q10)
  // ──────────────────────────────────────────
  {
    id: 1, category: 'general', theme: 'manga', difficulty: 'debutant',
    question: "Dans le manga Naruto, quel est le rêve ultime du jeune Naruto Uzumaki ?",
    answers: ["Devenir Hokage","Venger son clan","Devenir le roi des ninjas","Capturer tous les démons à queues"],
    correct: 0,
    focus: "Naruto souhaite devenir le leader de son village pour être enfin reconnu et respecté par tous."
  },
  {
    id: 2, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans World of Warcraft, quelle cité est la capitale principale des Humains ?",
    answers: ["Hurlevent","Orgrimmar","Forgefer","Darnassus"],
    correct: 0,
    focus: "Hurlevent (Stormwind) est le cœur de l'Alliance sur le continent des Royaumes de l'Est."
  },
  {
    id: 3, category: 'general', theme: 'manga', difficulty: 'debutant',
    question: "Dans One Piece, quel est le pouvoir principal du fruit du démon de Luffy ?",
    answers: ["L'élasticité (caoutchouc)","Le feu","L'invisibilité","Le vol"],
    correct: 0,
    focus: "Luffy a mangé le Gomu Gomu no Mi, faisant de lui un homme-caoutchouc."
  },
  {
    id: 4, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans Final Fantasy VII, comment s'appelle l'épée massive de Cloud Strife ?",
    answers: ["L'Épée Broyeuse","Masamune","Lionheart","Excalibur"],
    correct: 0,
    focus: "Connue sous le nom de Buster Sword, elle lui a été transmise par Zack Fair."
  },
  {
    id: 5, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans Kingdom Hearts, quel est le nom de l'arme en forme de clé de Sora ?",
    answers: ["La Keyblade","La Soul Eater","L'Épée de Lumière","Le Sceptre Royal"],
    correct: 0,
    focus: "La Keyblade est une arme mystérieuse capable de sceller les serrures des mondes."
  },
  {
    id: 6, category: 'general', theme: 'manga', difficulty: 'debutant',
    question: "Dans GTO, quel était l'ancien métier/passe-temps d'Eikichi Onizuka ?",
    answers: ["Chef de gang de motards","Policier","Chanteur de rock","Boxeur professionnel"],
    correct: 0,
    focus: "Onizuka était un voyou légendaire faisant partie du duo Onibaku Combi."
  },
  {
    id: 7, category: 'general', theme: 'manga', difficulty: 'debutant',
    question: "Dans Berserk, quel est le surnom de Guts après avoir quitté la Troupe du Faucon ?",
    answers: ["Le Chevalier Noir","Le Faucon Blanc","Le Tueur de Dragons","Le Guerrier de Fer"],
    correct: 0,
    focus: "Guts parcourt le monde seul, vêtu de noir et traquant les apôtres."
  },
  {
    id: 8, category: 'general', theme: 'roman', difficulty: 'debutant',
    question: "Dans le roman 'Ça', sous quelle apparence le monstre se présente-t-il le plus souvent ?",
    answers: ["Un clown","Un loup-garou","Une araignée géante","Une momie"],
    correct: 0,
    focus: "Il utilise l'apparence de Pennywise (Grippe-Sou) le Clown pour attirer les enfants."
  },
  {
    id: 9, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans Golden Sun, comment s'appelle l'énergie spirituelle utilisée par les Mystiques ?",
    answers: ["La Psynergie","Le Mana","Le Chakra","L'Alchimie"],
    correct: 0,
    focus: "La Psynergie permet de manipuler les éléments et d'interagir avec l'environnement."
  },
  {
    id: 10, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans Final Fantasy X, quel sport sous-marin est la passion de Tidus ?",
    answers: ["Le Blitzball","Le Water-Polo","Le Sphere Break","La Course de Chocobos"],
    correct: 0,
    focus: "Le Blitzball se joue dans une sphère d'eau géante et est une institution sur Spira."
  },

  // ──────────────────────────────────────────
  // GÉNÉRAL — CONNAISSEUR (Q11–Q20)
  // ──────────────────────────────────────────
  {
    id: 11, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans Tower of God, comment appelle-t-on ceux qui entrent dans la Tour par eux-mêmes ?",
    answers: ["Les Irréguliers","Les Réguliers","Les Gardiens","Les Hauts Rangueurs"],
    correct: 0,
    focus: "Les Irréguliers sont ceux qui ouvrent les portes de la Tour par leur propre volonté."
  },
  {
    id: 12, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans Samurai Deeper Kyo, qui occupe le corps de Kyoshiro Mibu au début ?",
    answers: ["Kyo aux Yeux Pourpres","Le Roi Rouge","Muramasa","Nobunaga Oda"],
    correct: 0,
    focus: "L'esprit de Kyo est enfermé dans le corps de son rival Kyoshiro au début du récit."
  },
  {
    id: 13, category: 'general', theme: 'jv', difficulty: 'connaisseur',
    question: "Dans Final Fantasy IX, quelle est la particularité physique de Djidane ?",
    answers: ["Il a une queue de singe","Il a des ailes","Il a des yeux rouges","Il a des oreilles pointues"],
    correct: 0,
    focus: "Djidane possède une queue, vestige de son origine en tant que Genome."
  },
  {
    id: 14, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans 20th Century Boys, quel est le nom du mouvement dirigé par 'Ami' ?",
    answers: ["Le Parti de l'Amitié","Le Club des Enfants","L'Organisation du Nouveau Siècle","La Secte du Symbole"],
    correct: 0,
    focus: "Ami a créé ce parti pour prendre le contrôle du Japon et du monde."
  },
  {
    id: 15, category: 'general', theme: 'jv', difficulty: 'connaisseur',
    question: "Dans Kingdom Hearts II, quel est le lien entre Roxas et Sora ?",
    answers: ["Roxas est le Simili de Sora","Frère jumeau","Forme maléfique","Réincarnation"],
    correct: 0,
    focus: "Roxas a été créé au moment où Sora est devenu un Sans-cœur dans le premier jeu."
  },
  {
    id: 16, category: 'general', theme: 'jv', difficulty: 'connaisseur',
    question: "Dans World of Warcraft, quel dragon est l'antagoniste de 'Cataclysm' ?",
    answers: ["Aile de Mort (Deathwing)","Malygos","Alexstrasza","Nozdormu"],
    correct: 0,
    focus: "Aile de Mort est revenu pour détruire Azeroth après sa corruption par les Dieux Très Anciens."
  },
  {
    id: 17, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans 'The Greatest Estate Developer', qu'étudiait Kim Suho avant sa réincarnation ?",
    answers: ["Le Génie Civil","L'Architecture","La Finance","La Cuisine"],
    correct: 0,
    focus: "Ses connaissances en ingénierie civile sont la clé de sa réussite sur ses chantiers."
  },
  {
    id: 18, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans le manhwa Ares, quel est le nom du groupe de mercenaires du héros ?",
    answers: ["Les Mercenaires du Temple","Les Chevaliers d'Icaros","La Troupe du Faucon","L'Escadron de Chronos"],
    correct: 0,
    focus: "Ares, Michael et Baruna font partie de cette unité basée au Temple."
  },
  {
    id: 19, category: 'general', theme: 'roman', difficulty: 'connaisseur',
    question: "Dans 'Le Livre des Étoiles', quel sorcier prend Guillemot sous son aile ?",
    answers: ["Qadehar","Agathe","Bertram","L'Ombre"],
    correct: 0,
    focus: "Qadehar est un puissant sorcier du Pays d'Ys qui découvre le talent de Guillemot."
  },
  {
    id: 20, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans One Piece, quel membre de l'équipage est le premier à rejoindre Luffy ?",
    answers: ["Roronoa Zoro","Nami","Usopp","Coby"],
    correct: 0,
    focus: "Luffy sauve Zoro à Shells Town et il devient son premier compagnon."
  },

  // ──────────────────────────────────────────
  // GÉNÉRAL — OTAKU (Q21–Q30)
  // ──────────────────────────────────────────
  {
    id: 21, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans Berserk, comment s'appelle le rituel de sacrifice de la Troupe du Faucon ?",
    answers: ["L'Éclipse","Le Cataclysme","Le Sabbat","La Convergence"],
    correct: 0,
    focus: "L'Éclipse est le rituel où un porteur de Béhérit rouge devient membre des God Hand."
  },
  {
    id: 22, category: 'general', theme: 'jv', difficulty: 'otaku',
    question: "Dans FF VII, où se déroule la scène de la mort d'Aerith ?",
    answers: ["La Cité des Anciens","Le Cratère Nord","Midgar","Wutai"],
    correct: 0,
    focus: "C'est dans la Capitale Oubliée qu'Aerith prie avant d'être frappée par Sephiroth."
  },
  {
    id: 23, category: 'general', theme: 'jv', difficulty: 'otaku',
    question: "Dans Golden Sun: L'Âge Perdu, quel est le dernier phare à allumer ?",
    answers: ["Le Phare de Mars","Le Phare de Jupiter","Le Phare de Mercure","Le Phare de Vénus"],
    correct: 0,
    focus: "L'allumage du Phare de Mars au Nord marque le retour de l'Alchimie."
  },
  {
    id: 24, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans Naruto, qui est le créateur du Ninshû (Ermite Rikudô) ?",
    answers: ["Hagoromo Ôtsutsuki","Hamura Ôtsutsuki","Hashirama Senju","Indra Ôtsutsuki"],
    correct: 0,
    focus: "Hagoromo a enseigné le Ninshû pour connecter les gens entre eux via le chakra."
  },
  {
    id: 25, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans 20th Century Boys, quel est le vrai nom du deuxième 'Ami' ?",
    answers: ["Katsumata","Fukubee","Sadakiyo","Manjome"],
    correct: 0,
    focus: "Katsumata est le garçon dont personne ne se souvenait, il prend la suite de Fukubee."
  },
  {
    id: 26, category: 'general', theme: 'jv', difficulty: 'otaku',
    question: "Dans WoW, quel conseiller d'Azshara est devenu le premier Satyre ?",
    answers: ["Xavius","Cenarius","Malfurion","Peroth'arn"],
    correct: 0,
    focus: "Xavius a été transformé par Sargeras après l'échec de la Guerre des Anciens."
  },
  {
    id: 27, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans Tower of God, quelle arme Yuri prête-t-elle à Bam au début ?",
    answers: ["Mars Noir","Avril Vert","Octobre de Cristal","Janvier Argenté"],
    correct: 0,
    focus: "La 'Black March' est une aiguille de la série des 13 mois possédant un esprit féminin."
  },
  {
    id: 28, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans Samurai Deeper Kyo, quel est le nom de la technique ultime du Mumyo Jin ?",
    answers: ["Le Dragon d'Or (Shin Seiryu)","La Danse de la Lune","Le Suzaku","Le Cri du Phénix"],
    correct: 0,
    focus: "Le Shin Seiryu est la forme évoluée dévastatrice de la technique Seiryu."
  },
  {
    id: 29, category: 'general', theme: 'roman', difficulty: 'otaku',
    question: "Dans 'Le Livre des Étoiles', où résident les Gommons ?",
    answers: ["Le Monde Incertain","Les Limbes","Le Néant","Le Royaume de l'Ombre"],
    correct: 0,
    focus: "Le Monde Incertain est une dimension instable entre le Monde Réel et le Pays d'Ys."
  },
  {
    id: 30, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans 'The Greatest Estate Developer', quel est le nom du hamster géant invoqué ?",
    answers: ["Ppodong","Javier","Hammy","Groot"],
    correct: 0,
    focus: "Ppodong est l'esprit de la terre qui aide Lloyd pour les travaux de terrassement."
  },

  // ──────────────────────────────────────────
  // GÉNÉRAL — DÉBUTANT (Q31–Q40)
  // ──────────────────────────────────────────
  {
    id: 31, category: 'general', theme: 'manga', difficulty: 'debutant',
    question: "Dans One Piece, de qui Luffy a-t-il reçu son célèbre chapeau de paille ?",
    answers: ["Shanks le Roux","Gol D. Roger","Monkey D. Garp","Portgas D. Ace"],
    correct: 0,
    focus: "Shanks a confié son chapeau à Luffy en lui demandant de le lui rendre une fois qu'il serait devenu un grand pirate."
  },
  {
    id: 32, category: 'general', theme: 'manga', difficulty: 'debutant',
    question: "Dans Naruto, comment s'appelle le mentor de l'Équipe 7, célèbre pour son œil masqué ?",
    answers: ["Kakashi Hatake","Jiraya","Might Guy","Iruka Umino"],
    correct: 0,
    focus: "Kakashi est le Jônin responsable de Naruto, Sasuke et Sakura au début de la série."
  },
  {
    id: 33, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans World of Warcraft, qui était le Chef de Guerre de la Horde au début du jeu (Vanilla) ?",
    answers: ["Thrall","Garrosh Hurlenfer","Sylvanas Coursevent","Vol'jin"],
    correct: 0,
    focus: "Thrall a libéré les Orcs et fondé la nouvelle Horde sur le continent de Kalimdor."
  },
  {
    id: 34, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans Final Fantasy VII, quel est le nom de la multinationale qui épuise l'énergie vitale de la planète ?",
    answers: ["La Shinra","Avalanche","SOLDIER","Galbadia"],
    correct: 0,
    focus: "La Shinra Electric Power Company contrôle Midgar et exploite l'énergie Mako."
  },
  {
    id: 35, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans Kingdom Hearts, comment s'appellent les deux meilleurs amis d'enfance de Sora sur l'Île du Destin ?",
    answers: ["Riku et Kairi","Donald et Dingo","Terra et Aqua","Axel et Roxas"],
    correct: 0,
    focus: "Le trio inséparable du début de l'aventure est composé de Sora, Riku et Kairi."
  },
  {
    id: 36, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans Golden Sun, quel élément est associé au protagoniste principal, Vlad (Isaac) ?",
    answers: ["Vénus","Mars","Mercure","Jupiter"],
    correct: 0,
    focus: "Dans Golden Sun, l'élément de la terre est appelé Vénus."
  },
  {
    id: 37, category: 'general', theme: 'manga', difficulty: 'debutant',
    question: "Dans Berserk, comment s'appelle l'immense épée que Guts utilise pour traquer les apôtres ?",
    answers: ["La Dragon Slayer","Zul'Gurub","L'Épée de Vorpal","Berserker Blade"],
    correct: 0,
    focus: "Forgée par Godot, cette épée massive est la seule capable de blesser les créatures astrales."
  },
  {
    id: 38, category: 'general', theme: 'manga', difficulty: 'debutant',
    question: "Dans GTO, quel est l'objectif premier d'Onizuka en devenant professeur ?",
    answers: ["Rencontrer des lycéennes mignonnes","Réformer le système scolaire","Gagner beaucoup d'argent","Se venger"],
    correct: 0,
    focus: "Au départ, Onizuka veut devenir prof pour s'entourer de jolies filles avant de trouver sa voie."
  },
  {
    id: 39, category: 'general', theme: 'roman', difficulty: 'debutant',
    question: "Dans le roman 'Ça', dans quelle ville du Maine se déroule l'histoire ?",
    answers: ["Derry","Castle Rock","Portland","Silent Hill"],
    correct: 0,
    focus: "Derry est la ville maudite où Grippe-Sou réapparaît tous les 27 ans."
  },
  {
    id: 40, category: 'general', theme: 'jv', difficulty: 'debutant',
    question: "Dans Final Fantasy X, quelle est la mission finale de l'Invokeur Yuna ?",
    answers: ["Détruire Sin","Devenir Reine","Retrouver son père","Apprendre le Blitzball"],
    correct: 0,
    focus: "Yuna doit obtenir l'Ultime Chimère pour apporter la Félicité en éliminant Sin."
  },

  // ──────────────────────────────────────────
  // GÉNÉRAL — CONNAISSEUR (Q41–Q50)
  // ──────────────────────────────────────────
  {
    id: 41, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans Tower of God, quel est le vrai nom (ou titre) par lequel le protagoniste Bam est désigné au début ?",
    answers: ["Vingt-cinquième Bam","Jyu Viole Grace","Urek Mazino","Phantaminum"],
    correct: 0,
    focus: "Il s'appelle ainsi car il est né le 25ème jour de la nuit (Bam signifiant nuit en coréen)."
  },
  {
    id: 42, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans Samurai Deeper Kyo, qui est le premier membre des 'Cinq Planètes' que Kyo doit affronter ?",
    answers: ["Akira","Hotaru","Shinrei","Bontenmaru"],
    correct: 0,
    focus: "Akira est le premier des anciens compagnons de Kyo qu'il affronte dans la forêt d'Aokigahara."
  },
  {
    id: 43, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans 20th Century Boys, quel est le titre de la chanson rock composée par Kenji ?",
    answers: ["Bob Lennon","Imagine","20th Century Boy","Sudala"],
    correct: 0,
    focus: "Cette chanson simple devient l'hymne de la résistance contre Ami."
  },
  {
    id: 44, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans le manhwa Ares, quelle particularité physique Ares manifeste-t-il en rage ?",
    answers: ["Ses yeux deviennent rouges","Il pleure du sang","Ses pupilles disparaissent","Il devient aveugle"],
    correct: 0,
    focus: "C'est la marque de sa lignée et de son instinct de tueur hérité de son père."
  },
  {
    id: 45, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans 'The Greatest Estate Developer', comment s'appelle le chevalier garde du corps de Lloyd ?",
    answers: ["Javier Asrahan","Yulian Provoke","Cale Henituse","Arthur Pendragon"],
    correct: 0,
    focus: "Javier est un épéiste de génie qui finit par respecter Lloyd malgré son caractère."
  },
  {
    id: 46, category: 'general', theme: 'roman', difficulty: 'connaisseur',
    question: "Dans 'Le Livre des Étoiles', quel est le principal talent magique de Guillemot ?",
    answers: ["Le tracé des graphies","La télépathie","La métamorphose","Le voyage temporel"],
    correct: 0,
    focus: "Guillemot est capable de dessiner des runes (graphies) dans les airs pour produire de la magie."
  },
  {
    id: 47, category: 'general', theme: 'jv', difficulty: 'connaisseur',
    question: "Dans World of Warcraft, qui prend la place d'Arthas sur le Trône de Glace ?",
    answers: ["Bolvar Fordragon","Tirion Fordring","Uther","Varian Wrynn"],
    correct: 0,
    focus: "Bolvar se sacrifie pour devenir le nouveau Roi Liche, gardien des morts."
  },
  {
    id: 48, category: 'general', theme: 'jv', difficulty: 'connaisseur',
    question: "Dans Final Fantasy IX, quelle est la véritable nature de Bibi (Vivi) ?",
    answers: ["Un prototype de Mage Noir","Un humain transformé","Un esprit de la forêt","Un enfant maudit"],
    correct: 0,
    focus: "Bibi est un être artificiel créé à partir de brume, doté d'une conscience unique."
  },
  {
    id: 49, category: 'general', theme: 'jv', difficulty: 'connaisseur',
    question: "Dans Kingdom Hearts II, qui est le leader de l'Organisation XIII ?",
    answers: ["Xemnas","Xigbar","Saïx","Marluxia"],
    correct: 0,
    focus: "Xemnas est le Simili de Xehanort qui cherche à créer un Kingdom Hearts artificiel."
  },
  {
    id: 50, category: 'general', theme: 'manga', difficulty: 'connaisseur',
    question: "Dans Naruto, quel est le lien de parenté entre le Quatrième Hokage et Naruto ?",
    answers: ["C'est son père","C'est son oncle","C'est son parrain","Aucun lien"],
    correct: 0,
    focus: "Minato Namikaze a sacrifié sa vie pour sceller Kyubi en son fils nouveau-né."
  },

  // ──────────────────────────────────────────
  // GÉNÉRAL — OTAKU (Q51–Q60)
  // ──────────────────────────────────────────
  {
    id: 51, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans Berserk, quel est le nom de l'objet mystique qui appartient à Griffith ?",
    answers: ["Le Crimson Beherit","L'Œil d'Odin","La Pierre Philosophale","Le Sceau de l'Éclipse"],
    correct: 0,
    focus: "C'est un artefact unique destiné à ceux qui rejoindront les God Hand."
  },
  {
    id: 52, category: 'general', theme: 'jv', difficulty: 'otaku',
    question: "Dans Final Fantasy VII, dans quel laboratoire Sephiroth a-t-il été conçu ?",
    answers: ["Nibelheim (Manoir)","Gongaga","Junon","Icicle Inn"],
    correct: 0,
    focus: "C'est là que le projet Jenova a débuté sous la direction du Pr Hojo."
  },
  {
    id: 53, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans One Piece, quel est le nom de l'Arme Antique cachée à Alabasta ?",
    answers: ["Pluton","Poséidon","Uranus","Noah"],
    correct: 0,
    focus: "Crocodile cherchait les plans de Pluton, un immense navire de guerre."
  },
  {
    id: 54, category: 'general', theme: 'jv', difficulty: 'otaku',
    question: "Dans Golden Sun, quel duo de guerriers affrontez-vous au sommet du phare de Vénus ?",
    answers: ["Saturos et Menardi","Karst et Agatio","Alex et Pavel","Dullahan et Valukar"],
    correct: 0,
    focus: "Ils sont les antagonistes du premier jeu et fusionnent pour former le Dragon Fusion."
  },
  {
    id: 55, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans Tower of God, comment s'appelle l'étage où Bam est 'mort' ?",
    answers: ["L'Étage des Tests","L'Étage de la Mort","Le Train de l'Enfer","Le rez-de-chaussée"],
    correct: 0,
    focus: "C'est au 2ème étage que Rachel le pousse dans le vide lors de l'examen final."
  },
  {
    id: 56, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans Samurai Deeper Kyo, quelle est l'identité du 'Dernier des Cinq Planètes' ?",
    answers: ["Saïsei","Chinmei","Anri","Yuan"],
    correct: 0,
    focus: "Saïsei est une femme maniant les fils et les pouvoirs de guérison."
  },
  {
    id: 57, category: 'general', theme: 'jv', difficulty: 'otaku',
    question: "Dans World of Warcraft, quel est le nom du monde natal des Orcs ?",
    answers: ["Draenor","Argus","Azeroth","K'aresh"],
    correct: 0,
    focus: "Draenor a été brisé pour devenir l'Outreterre (Outland)."
  },
  {
    id: 58, category: 'general', theme: 'manga', difficulty: 'otaku',
    question: "Dans 20th Century Boys, quel événement est prédit pour l'an 2000 ?",
    answers: ["Un robot diffusant un virus","Une explosion nucléaire","Une invasion alien","Un séisme"],
    correct: 0,
    focus: "Ami réalise cette prédiction d'enfance pour passer pour le sauveur du monde."
  },
  {
    id: 59, category: 'general', theme: 'roman', difficulty: 'otaku',
    question: "Dans 'Le Livre des Étoiles', quel est le secret de la 'Vraie Magie' de Qadehar ?",
    answers: ["Tracer les runes sur sa peau","Du sang de Gomon","Noms à l'envers","Fusionner"],
    correct: 0,
    focus: "En traçant les runes sur lui, le sorcier devient le catalyseur direct de l'énergie."
  },
  {
    id: 60, category: 'general', theme: 'jv', difficulty: 'otaku',
    question: "Dans Final Fantasy X, quelle est la véritable nature des Priants ?",
    answers: ["Des âmes figées qui rêvent","Des machines anciennes","Enfants de Yu Yevon","Monstres purifiés"],
    correct: 0,
    focus: "Leurs rêves permettent de manifester les Chimères et la cité de Zanarkand."
  },

  // ──────────────────────────────────────────
  // GAMEPLAY/SECRETS — DÉBUTANT (Q61–Q65)
  // ──────────────────────────────────────────
  {
    id: 61, category: 'gameplay', theme: 'gameplay', difficulty: 'debutant',
    question: "Dans WoW, que crie Leroy Jenkins en se jetant seul dans le combat ?",
    answers: ["Leeeeeroy Jeeenkins!","For the Horde!","Death to the Alliance!","I'm coming for you!"],
    correct: 0,
    focus: "Ce mème légendaire est né d'une vidéo où un joueur fonce dans un donjon en criant son nom."
  },
  {
    id: 62, category: 'gameplay', theme: 'gameplay', difficulty: 'debutant',
    question: "Dans Final Fantasy, quel objet iconique sert à ressusciter un personnage ?",
    answers: ["Une Queue de Phénix","Un Élixir","Une Potion","Une Corne de Licorne"],
    correct: 0,
    focus: "Le phénix symbolise la renaissance, cet objet est un classique de la série."
  },
  {
    id: 63, category: 'gameplay', theme: 'gameplay', difficulty: 'debutant',
    question: "Dans Kingdom Hearts, comment s'appelle l'arme principale de Sora ?",
    answers: ["La Keyblade","L'Épée de Lumière","Le Sceptre du Cœur","La Clé du Destin"],
    correct: 0,
    focus: "C'est une arme en forme de clé capable de sceller ou d'ouvrir les portes des mondes."
  },
  {
    id: 64, category: 'gameplay', theme: 'gameplay', difficulty: 'debutant',
    question: "Dans Kingdom Hearts, qui sont les ennemis nés de la perte d'un cœur ?",
    answers: ["Les Sans-cœur","Les Similis","Les Nescients","Les Avaleurs de Rêves"],
    correct: 0,
    focus: "Les Heartless sont les ombres de ceux qui ont succombé aux ténèbres."
  },
  {
    id: 65, category: 'gameplay', theme: 'gameplay', difficulty: 'debutant',
    question: "Dans WoW (Vanilla), quel était le niveau maximum atteignable ?",
    answers: ["60","70","80","100"],
    correct: 0,
    focus: "Le niveau 60 était le sommet ultime avant la sortie de la première extension."
  },

  // ──────────────────────────────────────────
  // GAMEPLAY/SECRETS — CONNAISSEUR (Q66–Q70)
  // ──────────────────────────────────────────
  {
    id: 66, category: 'gameplay', theme: 'gameplay', difficulty: 'connaisseur',
    question: "En 2005, quel incident sur WoW a vu une épidémie virtuelle décimer les capitales ?",
    answers: ["Le Sang Corrompu","La Peste de Lordaeron","Le Fléau d'Orgrimmar","La Malédiction de Hakkar"],
    correct: 0,
    focus: "Un débuff du boss Hakkar s'est propagé accidentellement, créant une pandémie mondiale."
  },
  {
    id: 67, category: 'gameplay', theme: 'gameplay', difficulty: 'connaisseur',
    question: "Dans Final Fantasy, quel système de combat utilise des barres qui se chargent ?",
    answers: ["ATB (Active Time Battle)","Turn Based","Real-Time Action","Gambit System"],
    correct: 0,
    focus: "Introduit dans FF IV, il apporte du dynamisme en gérant le temps de recharge des actions."
  },
  {
    id: 68, category: 'gameplay', theme: 'gameplay', difficulty: 'connaisseur',
    question: "Dans Kingdom Hearts II, comment s'appelle le 'Simili' de Sora ?",
    answers: ["Roxas","Ventus","Vanitas","Riku"],
    correct: 0,
    focus: "Roxas est né quand Sora est devenu un Sans-cœur, il manie lui aussi la Keyblade."
  },
  {
    id: 69, category: 'gameplay', theme: 'gameplay', difficulty: 'connaisseur',
    question: "Qui est le 'Red Shirt Guy' devenu célèbre pour avoir corrigé le lore à la BlizzCon ?",
    answers: ["Ian Bates","Leroy Jenkins","Metzen","Ghostcrawler"],
    correct: 0,
    focus: "Sa question sur Falstad Wildhammer était si précise qu'un PNJ a été ajouté en jeu."
  },
  {
    id: 70, category: 'gameplay', theme: 'gameplay', difficulty: 'connaisseur',
    question: "Dans Final Fantasy VII, où se déroule le célèbre mini-jeu du 'date' ?",
    answers: ["Au Gold Saucer","À Midgar","À Costa del Sol","À Wutai"],
    correct: 0,
    focus: "Selon vos choix, vous pouvez finir au parc d'attraction avec Aerith, Tifa, Yuffie ou Barret."
  },

  // ──────────────────────────────────────────
  // GAMEPLAY/SECRETS — OTAKU (Q71–Q75)
  // ──────────────────────────────────────────
  {
    id: 71, category: 'gameplay', theme: 'gameplay', difficulty: 'otaku',
    question: "Quel item de triche un MJ a-t-il envoyé par erreur à un joueur de WoW en 2009 ?",
    answers: ["Martin Fury","Sword of a Thousand Truths","Ashbringer","The Instakiller"],
    correct: 0,
    focus: "Cette chemise permettait de tuer n'importe quelle entité sur 30m. Le joueur a été banni."
  },
  {
    id: 72, category: 'gameplay', theme: 'gameplay', difficulty: 'otaku',
    question: "Quel événement a marqué la fin cataclysmique de FF XIV 1.0 ?",
    answers: ["La chute de Dalamud","L'avènement de Zénos","L'invasion de l'Empire","Le déluge de lumière"],
    correct: 0,
    focus: "Naoki Yoshida a détruit le jeu par une cinématique épique pour relancer 'A Realm Reborn'."
  },
  {
    id: 73, category: 'gameplay', theme: 'gameplay', difficulty: 'otaku',
    question: "Quel est le titre de la fin secrète de Kingdom Hearts 1 ?",
    answers: ["Another Side, Another Story","Blank Points","The Gathering","Deep Dive"],
    correct: 0,
    focus: "Montrait pour la première fois Roxas et Riku luttant sous la pluie à la cité de l'Illusion."
  },
  {
    id: 74, category: 'gameplay', theme: 'gameplay', difficulty: 'otaku',
    question: "Comment s'appelait l'infâme 'ganker' de l'Alliance sur le serveur Sargeras ?",
    answers: ["Angwe","Swifty","Kungen","Athene"],
    correct: 0,
    focus: "Angwe campait le port de Menethil pendant des mois, devenant une légende (ou un cauchemar)."
  },
  {
    id: 75, category: 'gameplay', theme: 'gameplay', difficulty: 'otaku',
    question: "Quelle classe de Final Fantasy apprend des sorts en se faisant attaquer ?",
    answers: ["Mage Bleu","Mage Rouge","Mime","Freelancer"],
    correct: 0,
    focus: "Le Mage Bleu doit subir certaines attaques ennemies pour les assimiler à son répertoire."
  },

  // ──────────────────────────────────────────
  // SÉRIES & ANIMATION — DÉBUTANT (Q76–Q80)
  // ──────────────────────────────────────────
  {
    id: 76, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[HIMYM] Dans quel bar la bande de Ted passe-t-elle la quasi-totalité de son temps ?",
    answers: ["Le MacLaren's Pub","Puzzles","Central Perk","Cheers"],
    correct: 0,
    focus: "Le MacLaren's se situe juste en dessous de l'appartement de Ted et Marshall."
  },
  {
    id: 77, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[Parks & Rec] Dans quelle ville (fictive) de l'Indiana se déroule la série ?",
    answers: ["Pawnee","Eagleton","Scranton","Springfield"],
    correct: 0,
    focus: "Leslie Knope est une fervente défenseuse de sa ville natale, Pawnee."
  },
  {
    id: 78, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[RPDR] Quelle est la phrase culte que RuPaul prononce pour éliminer une candidate ?",
    answers: ["Sashay Away","Shantay You Stay","Lip Sync for your Life","You're Fired"],
    correct: 0,
    focus: "Sashay Away signifie qu'il est temps de quitter le podium et la compétition."
  },
  {
    id: 79, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[Rick & Morty] Quel objet Rick utilise-t-il pour voyager instantanément entre les dimensions ?",
    answers: ["Le Portal Gun","Le TARDIS","La Boîte à Meeseeks","Le Vaisseau-Poubelle"],
    correct: 0,
    focus: "Le Portal Gun projette un liquide vert créant un tunnel dimensionnel."
  },
  {
    id: 80, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[Archer] Comment s'appelle la mère d'Archer, qui est aussi la directrice de l'agence d'espionnage ?",
    answers: ["Malory Archer","Lana Kane","Cheryl Tunt","Pam Poovey"],
    correct: 0,
    focus: "Malory est la matriarche cynique et alcoolique qui dirige l'agence ISIS (puis l'agence de détective)."
  },

  // ──────────────────────────────────────────
  // SÉRIES & ANIMATION — CONNAISSEUR (Q81–Q85)
  // ──────────────────────────────────────────
  {
    id: 81, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[Big Mouth] Quel célèbre musicien de jazz décédé vit sous forme de fantôme dans le grenier de Nick ?",
    answers: ["Duke Ellington","Louis Armstrong","Miles Davis","Ray Charles"],
    correct: 0,
    focus: "Duke Ellington sert souvent de guide spirituel (ou maladroit) à Nick dans ses problèmes pubertaires."
  },
  {
    id: 82, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[Parks & Rec] Quel est le nom de l'alter ego de Ron Swanson lorsqu'il joue du saxophone dans des clubs de jazz ?",
    answers: ["Duke Silver","Burt Macklin","Ronny S","Jazz Man"],
    correct: 0,
    focus: "Duke Silver est le secret le mieux gardé de Ron, car il est une icône sensuelle pour les femmes mûres d'Eagleton."
  },
  {
    id: 83, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[HIMYM] Quel est le titre du blog (réellement créé par la production) que Barney Stinson alimente régulièrement ?",
    answers: ["Le Barney's Blog","The Bro Code Online","Legendary Journal","Suit Up Now"],
    correct: 0,
    focus: "Barney y postait des conseils de séduction et des théories farfelues sur les 'bros'."
  },
  {
    id: 84, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[Rick & Morty] Dans quel épisode mémorable Rick se transforme-t-il en légume pour échapper à une thérapie familiale ?",
    answers: ["Pickle Rick","Rick-ornichon","Cronenberg Rick","The Ricklantis Mixup"],
    correct: 0,
    focus: "Rick préfère devenir un cornichon et affronter des rats et des agents russes plutôt que de parler de ses sentiments."
  },
  {
    id: 85, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[RPDR] Quel est le nom du célèbre défi d'imitation de célébrités qui a lieu à chaque saison ?",
    answers: ["Le Snatch Game","The Shade Tree","Drag Race Idol","Queens on Fire"],
    correct: 0,
    focus: "Le Snatch Game est l'épreuve reine testant l'humour, l'improvisation et le charisme des queens."
  },

  // ──────────────────────────────────────────
  // SÉRIES & ANIMATION — OTAKU (Q86–Q90)
  // ──────────────────────────────────────────
  {
    id: 86, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[Archer] Quel est le nom du majordome d'Archer, vétéran de la Première Guerre mondiale et souffre-douleur de Sterling ?",
    answers: ["Woodhouse","Alfred","Geoffrey","Jarvis"],
    correct: 0,
    focus: "Woodhouse a une histoire fascinante en tant que pilote de guerre, malgré le traitement exécrable que lui fait subir Archer."
  },
  {
    id: 87, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[HIMYM] Barney travaille pour la GNB, mais quel est l'acronyme exact de son poste (P.L.E.A.S.E) ?",
    answers: ["Provide Legal Exculpation And Sign Everything","Professional Lawyer Exposing All Sales Errors","Permanent Liaison Engineering And Security Expert","Please Leave Every Area Safe Everyday"],
    correct: 0,
    focus: "Barney répondait toujours 'Please !' quand on lui demandait son métier ; c'était en fait un acronyme signifiant qu'il signait des documents compromettants sans poser de questions."
  },
  {
    id: 88, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[Parks & Rec] Comment s'appelle le poney miniature que toute la ville de Pawnee idolâtre ?",
    answers: ["Li'l Sebastian","Pony Danza","Silver","Champ"],
    correct: 0,
    focus: "La mort de Li'l Sebastian est un deuil municipal massif, marqué par la chanson '5,000 Candles in the Wind'."
  },
  {
    id: 89, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[Big Mouth] Qui est le 'Shame Wizard' (le Magicien de la Honte), l'ennemi juré des Monstres de l'Hormone ?",
    answers: ["Lionel","Maurice","Connie","Caleb"],
    correct: 0,
    focus: "Lionel se nourrit de la honte des adolescents et essaie de les faire se sentir mal par rapport à leurs désirs."
  },
  {
    // ⚠️ CORRECTION : dans le PDF la bonne réponse n'était pas cochée (toutes ☐)
    id: 90, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[RPDR] Quelle reine a été la toute première à être éliminée dans l'histoire de l'émission (Saison 1) ?",
    answers: ["Victoria 'Porkchop' Parker","Bebe Zahara Benet","Nina Flowers","Akashia"],
    correct: 0,
    focus: "Victoria 'Porkchop' Parker est devenue une légende récurrente, saluée par RuPaul à chaque finale."
  },

  // ──────────────────────────────────────────
  // SÉRIES & ANIMATION — DÉBUTANT (Q91–Q95)
  // ──────────────────────────────────────────
  {
    id: 91, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[HIMYM] Quelle est l'expression favorite de Barney Stinson pour dire que quelque chose va être génial ?",
    answers: ["Legen-wait for it-dary!","Awesome!","High Five!","Challenge Accepted!"],
    correct: 0,
    focus: "Cette expression est la marque de fabrique du personnage pour souligner l'aspect épique d'une soirée."
  },
  {
    id: 92, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[Parks & Rec] Quel est le plat préféré de Leslie Knope qu'elle mange toujours au restaurant JJ's Diner ?",
    answers: ["Les Gaufres","Les Pancakes","Le Bacon","La Calzone"],
    correct: 0,
    focus: "Leslie considère les gaufres de JJ's Diner comme le meilleur aliment au monde."
  },
  {
    id: 93, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[Big Mouth] Comment s'appelle le 'Monstre des Hormones' principal qui suit Andrew ?",
    answers: ["Maurice","Connie","Rick","Gavin"],
    correct: 0,
    focus: "Maurice (Maury) est le monstre libidineux et poilu qui pousse Andrew à faire des choix souvent embarrassants."
  },
  {
    id: 94, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[Archer] Quel est le nom de code de Sterling Archer ?",
    answers: ["Duchess","Lancelot","Falcon","Sterling"],
    correct: 0,
    focus: "C'était le nom du chien de sa mère, ce qui est une source constante de moqueries."
  },
  {
    id: 95, category: 'series', theme: 'series', difficulty: 'debutant',
    question: "[Rick & Morty] Quelle est la relation de parenté entre Rick et Morty ?",
    answers: ["Grand-père et petit-fils","Père et fils","Oncle et neveu","Frères"],
    correct: 0,
    focus: "Rick Sanchez est le père de Beth, la mère de Morty."
  },

  // ──────────────────────────────────────────
  // SÉRIES & ANIMATION — CONNAISSEUR (Q96–Q100)
  // ──────────────────────────────────────────
  {
    id: 96, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[RPDR] Que signifie l'acronyme C.U.N.T., les quatre qualités recherchées par RuPaul ?",
    answers: ["Charisma, Uniqueness, Nerve, Talent","Class, Uniqueness, Nice, Taste","Courage, Unity, Night, Trick","Creative, Ugly, Nice, Tough"],
    correct: 0,
    focus: "Ces quatre piliers définissent la 'Next Drag Superstar'."
  },
  {
    id: 97, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[HIMYM] Sous quel pseudonyme Robin Scherbatsky était-elle une star de la pop au Canada ?",
    answers: ["Robin Sparkles","Robin Daggers","Pop Robin","Canadian Star"],
    correct: 0,
    focus: "Son tube 'Let's Go to the Mall' est l'un des plus grands secrets révélés par la bande."
  },
  {
    id: 98, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[Parks & Rec] Comment s'appelle le groupe de rock dirigé par Andy Dwyer ?",
    answers: ["MouseRat","Scarecrow Boat","Threeskin","Fleetwood Mac Sex Tape"],
    correct: 0,
    focus: "Le groupe a eu de nombreux noms avant de rester sur MouseRat pour de bon."
  },
  {
    id: 99, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[Rick & Morty] Quel est le nom de la dimension d'origine de 'notre' Rick et Morty ?",
    answers: ["C-137","Z-402","Earth-Prime","Dimension 35-C"],
    correct: 0,
    focus: "Rick se vante souvent d'être le Rick de la dimension C-137, la plus 'pure'."
  },
  {
    id: 100, category: 'series', theme: 'series', difficulty: 'connaisseur',
    question: "[Archer] Quelle est l'obsession/peur récurrente d'Archer concernant la nature ?",
    answers: ["Les Alligators","Les Requins","Les Ours","Les Méduses"],
    correct: 0,
    focus: "Archer a une liste de peurs irrationnelles, mais les alligators et crocodiles sont au sommet."
  },

  // ──────────────────────────────────────────
  // SÉRIES & ANIMATION — OTAKU (Q101–Q105)
  // ──────────────────────────────────────────
  {
    id: 101, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[Big Mouth] Dans quel département travaillent les monstres et les sorciers de la honte ?",
    answers: ["Human Resources","Department of Puberty","Teen Management","Soul Control"],
    correct: 0,
    focus: "Le spin-off 'Human Resources' explore d'ailleurs ce lieu administratif fantastique."
  },
  {
    id: 102, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[RPDR] Quelle candidate de la saison 4 a été la première de l'histoire à être disqualifiée ?",
    answers: ["Willam Belli","Sharon Needles","Phi Phi O'Hara","Latrice Royale"],
    correct: 0,
    focus: "Willam a été exclue pour avoir reçu des visites de son mari, enfreignant les règles strictes de production."
  },
  {
    id: 103, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[HIMYM] Dans l'épisode du 'Pari des baffes', combien de baffes Barney doit-il recevoir au total ?",
    answers: ["8 baffes","5 baffes","10 baffes","12 baffes"],
    correct: 0,
    focus: "Initialement 5, puis Marshall gagne le droit d'en ajouter 3 lors de l'épisode de Thanksgiving."
  },
  {
    id: 104, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[Parks & Rec] Quel est le titre du jeu de société ultra-complexe inventé par Ben Wyatt ?",
    answers: ["The Cones of Dunshire","Quest for Pawnee","Mace and Chain","Wizard's Journey"],
    correct: 0,
    focus: "Ben a créé ce jeu par ennui pur, et il finit par devenir un succès culte plus tard."
  },
  {
    id: 105, category: 'series', theme: 'series', difficulty: 'otaku',
    question: "[Rick & Morty] Que signifie réellement l'expression 'Wubba Lubba Dub-Dub' en langue Birdperson ?",
    answers: ["Je souffre énormément, aidez-moi","C'est la fête !","Je suis le roi du monde","Morty est un idiot"],
    correct: 0,
    focus: "Ce n'est pas une phrase de fête, mais un cri de désespoir caché par Rick."
  }
];

// Points par difficulté
export const DIFFICULTY_POINTS = {
  debutant: 1,
  connaisseur: 2,
  otaku: 3
};

// Labels
export const DIFFICULTY_LABELS = {
  debutant: 'Débutant',
  connaisseur: 'Connaisseur',
  otaku: 'Otaku'
};

// Expose globally
window.QUESTIONS = QUESTIONS;
window.DIFFICULTY_POINTS = DIFFICULTY_POINTS;
window.DIFFICULTY_LABELS = DIFFICULTY_LABELS;
