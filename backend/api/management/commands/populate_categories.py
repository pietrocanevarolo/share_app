from django.core.management.base import BaseCommand
from api.models import Category


categories = [
    {
        "name": "Veicoli e Trasporti",
        "subcategories": [
            "Automobili",
            "Biciclette",
            "Moto e scooter",
            "Camper e roulotte",
            "Barche e yacht",
            "Jet privati e elicotteri",
            "Monopattini elettrici",
            "Furgoni e camion",
            "Limousine",
            "Carrelli elevatori",
            "Veicoli per disabili",
            "Auto d'epoca"
        ]
    },
    {
        "name": "Attrezzature per la casa e giardinaggio",
        "subcategories": [
            "Utensili da giardino",
            "Attrezzature per il fai-da-te",
            "Elettrodomestici",
            "Aspirapolvere industriali",
            "Generatori di corrente",
            "Compressori d'aria",
            "Scale e impalcature",
            "Idropulitrici"
        ]
    },
    {
        "name": "Tecnologia e Elettronica",
        "subcategories": [
            "Computer e laptop",
            "Telecamere e attrezzature fotografiche",
            "Sistemi audio e video",
            "Strumenti musicali",
            "Consolle per videogiochi",
            "Attrezzature VR/AR",
            "Proiettori e schermi",
            "Stampanti e scanner"
        ]
    },
    {
        "name": "Attrezzature sportive e per il tempo libero",
        "subcategories": [
            "Attrezzatura da sci e snowboard",
            "Attrezzatura da campeggio",
            "Tavole da surf e paddleboard",
            "Attrezzature da immersione e snorkeling",
            "Kayak e canoe",
            "Materiale da pesca",
            "Attrezzature da golf",
            "Bici da montagna e da corsa",
            "Equipaggiamento per sport estremi"
        ]
    },
    {
        "name": "Abbigliamento e Accessori",
        "subcategories": [
            "Abiti da cerimonia",
            "Costumi per feste e eventi",
            "Accessori di lusso",
            "Abiti e uniformi professionali",
            "Tute da sci",
            "Vestiti per occasioni speciali"
        ]
    },
    {
        "name": "Servizi per eventi",
        "subcategories": [
            "Attrezzature per catering",
            "Macchine per effetti speciali",
            "Gonfiabili per feste",
            "Tavoli e sedie",
            "Tendoni e gazebi",
            "Piste da ballo portatili",
            "Fontane di cioccolato",
            "Attrezzature per DJ"
        ]
    },
    {
        "name": "Attrezzature professionali e commerciali",
        "subcategories": [
            "Macchine edili",
            "Attrezzature agricole",
            "Uffici mobili e container",
            "Attrezzature per conferenze",
            "Attrezzature da ufficio",
            "Attrezzature per la ristorazione",
            "Attrezzature mediche"
        ]
    },
    {
        "name": "Articoli sanitari e di assistenza",
        "subcategories": [
            "Sedie a rotelle e scooter elettrici",
            "Attrezzature per la riabilitazione",
            "Letti ospedalieri",
            "Sollevatori per disabili",
            "Apparecchiature per ossigenoterapia",
            "Montascale"
        ]
    },
    {
        "name": "Prodotti per l'infanzia",
        "subcategories": [
            "Carrozzine e passeggini",
            "Seggiolini auto",
            "Giocattoli e attrezzature per il tempo libero",
            "Lettini e culle",
            "Marsupi e zaini porta bebè",
            "Seggioloni per la pappa"
        ]
    },
    {
        "name": "Animali domestici e accessori",
        "subcategories": [
            "Gabbie e trasportini",
            "Attrezzature per l'addestramento",
            "Recinti e cucce",
            "Accessori per il viaggio",
            "Tosatrici per animali"
        ]
    },
    {
        "name": "Altre categorie varie",
        "subcategories": [
            "Libri e materiali didattici",
            "Videocamere per la sicurezza",
            "Mobili",
            "Abbigliamento e attrezzature per il lavoro",
            "Droni",
            "Decorazioni per feste e matrimoni",
            "Vasi e fioriere",
            "Attrezzature per la pulizia industriale",
            "Tappeti e moquette"
        ]
    }
]


class Command(BaseCommand):
    help = 'Popola il database con le categorie iniziali'

    def handle(self, *args, **kwargs):
        for category_data in categories:
            parent_category, created = Category.objects.get_or_create(name=category_data['name'], parent=None)
            for subcategory_name in category_data['subcategories']:
                Category.objects.get_or_create(name=subcategory_name, parent=parent_category)
        self.stdout.write(self.style.SUCCESS('Database popolato con successo!'))