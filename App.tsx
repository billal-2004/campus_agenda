import React from "react";
import {View,Text,FlatList,StyleSheet,} from "react-native";

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  {id: "E01",titre: "Atelier React",categorie: "Atelier",capacite: 25,inscrits: 25,},
  {id: "E02",titre: "Conférence IA",categorie: "Conférence",capacite: 70,inscrits: 52,},
  {id: "E03",titre: "Sécurité mobile",categorie: "Atelier",capacite: 20,inscrits: 17,},
  {id: "E04",titre: "Design UI",categorie: "Atelier",capacite: 18,inscrits: 9,},
  {id: "E05",titre: "Forum projets",categorie: "Rencontre",capacite: 50,inscrits: 49,},
  {id: "E06",titre: "Découverte Git",categorie: "Atelier",capacite: 24,inscrits: 24,},
];

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): string {
  const places = placesRestantes(e);
  if (places === 0) {
    return "Complet";
  } else if (places <= 3) {
    return "Presque complet";
  } else {
    return "Ouvert";
  }
}

const totalEvenements = evenements.length;

const evenementsComplets = evenements.filter(
  (e) => placesRestantes(e) === 0
).length;

const evenementsDisponibles = evenements.filter(
  (e) => placesRestantes(e) > 0
).length;

const totalPlaces = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);

const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === "Atelier" && placesRestantes(e) > 0
);

const mode = "tous";

const evenementsAffiches =
  mode === "tous" ? evenements : ateliersDisponibles;

type BadgeEtatProps = {
  statut: string;
};

function BadgeEtat({ statut }: BadgeEtatProps) {
  let couleur = "#22c55e";

  if (statut === "Complet") {
    couleur = "#fecaca";
  } else if (statut === "Presque complet") {
    couleur = "#fed7aa";
  }

  return (
    <View
      style={[styles.badge, { backgroundColor: couleur }]}
    >
      <Text>{statut}</Text>
    </View>
  );
}

type CarteEvenementProps = {
  evenement: Evenement;
};

function CarteEvenement({ evenement }: CarteEvenementProps) {
  return (
    <View style={styles.carte}>
      <Text style={styles.titreCarte}>
        {evenement.titre}
      </Text>

      <Text style={styles.categorie}>
        {evenement.categorie}
      </Text>

      <Text style={styles.places}>
        {placesRestantes(evenement)} places libres
      </Text>

      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}

type BlocStatistiqueProps = {
  label: string;
  valeur: number;
};

function BlocStatistique({
  label,
  valeur,
}: BlocStatistiqueProps) {
  return (
    <View style={styles.blocStatistique}>
      <Text style={styles.valeur}>
        {valeur}
      </Text>

      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titrePrincipal}>
        CampusAgenda
      </Text>

      <Text style={styles.sousTitre}>
        Événements du campus
      </Text>

      {/* Statistiques */}
      <View style={styles.statistiques}>
        <BlocStatistique
          label="Total événements"
          valeur={totalEvenements}
        />

        <BlocStatistique
          label="Événements complets"
          valeur={evenementsComplets}
        />

        <BlocStatistique
          label="Événements disponibles"
          valeur={evenementsDisponibles}
        />

        <BlocStatistique
          label="Places restantes"
          valeur={totalPlaces}
        />
      </View>

      {/* Mode d'affichage */}
      <Text style={styles.titreListe}>
        {mode === "tous"
          ? "Tous les événements"
          : "Ateliers disponibles"}
      </Text>

      {/* Liste des événements */}
      <FlatList
        data={evenementsAffiches}
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.messageVide}>
            Aucun événement disponible.
          </Text>
        }
        contentContainerStyle={
          evenementsAffiches.length === 0
            ? styles.listeVide
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,backgroundColor: "#f3f4f6",padding: 15,paddingTop: 50,
  },

  titrePrincipal: {
    fontSize: 28,fontWeight: "bold",color: "#2563eb",
  },

  sousTitre: {
    fontSize: 16,color: "#666666",marginTop: 5,
  },

  statistiques: {
    flexDirection: "row",flexWrap: "wrap",justifyContent: "space-between",marginTop: 20,
  },

  blocStatistique: {
    width: "48%",backgroundColor: "#ffffff",padding: 15,marginBottom: 10,
    borderRadius: 12,alignItems: "center",borderWidth: 1,borderColor: "#dddddd",
  },

  valeur: {
    fontSize: 22,fontWeight: "bold",color: "#2563eb",
  },

  label: {
    fontSize: 12,color: "#666666",textAlign: "center",marginTop: 5,
  },

  titreListe: {
    fontSize: 20,fontWeight: "bold",marginTop: 15,marginBottom: 5,color: "#222222",
  },

  carte: {
    backgroundColor: "#ffffff",padding: 16,marginVertical: 8,borderRadius: 12,
    borderWidth: 1,borderColor: "#dddddd",
  },

  titreCarte: {
    fontSize: 18,fontWeight: "bold",color: "#222222",
  },

  categorie: {
    color: "#666666",marginTop: 5,
  },

  places: {
    marginTop: 8,marginBottom: 8,fontSize: 14,
  },

  badge: {
    alignSelf: "flex-start",padding: 8,borderRadius: 8,
  },

  messageVide: {
    textAlign: "center",marginTop: 30,fontSize: 16,color: "#666666",},

  listeVide: {flexGrow: 1},
});
