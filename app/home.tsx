import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Button,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Drug {
  id: string;
  brand_name: string;
  generic_name: string;
  manufacturer_name: string;
}

// Create a context for managing click count
const ClickCountContext = createContext<{ count: number; increment: () => void }>({
  count: 0,
  increment: () => {},
});

export function HomeScreen() {
  const { username } = useLocalSearchParams();
  const router = useRouter();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  const { count, increment } = useContext(ClickCountContext);

  const fetchDrugs = async (search: string = '', retries: number = 3) => {
    try {
      setError(null);
      const offset = Math.floor(Math.random() * 1000); // Add random offset
      const query = search ? `search=brand_name:${search}` : `limit=50&skip=${offset}`;
      const response = await fetch(
        `https://api.fda.gov/drug/event.json?${query}`
      );
      const data = await response.json();

      if (data.results) {
        const formattedDrugs = data.results.map((item: any) => ({
          id: item.safetyreportid,
          brand_name: item.patient?.drug?.[0]?.openfda?.brand_name?.[0] || 'Unknown',
          generic_name: item.patient?.drug?.[0]?.openfda?.generic_name?.[0] || 'Unknown',
          manufacturer_name: item.patient?.drug?.[0]?.openfda?.manufacturer_name?.[0] || 'Unknown',
        }));
        setDrugs(formattedDrugs);
      } else {
        setError('No drugs found');
      }
    } catch (err) {
      if (retries > 0) {
        console.warn(`Retrying... (${retries} attempts left)`);
        fetchDrugs(search, retries - 1);
      } else {
        setError('Failed to fetch drug data. Please check your network connection and try again later.');
        console.error('Error fetching drugs:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchDrugs(searchQuery);
  };

  const renderDrugItem = ({ item }: { item: Drug }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
      onPress={() => {
        setSelectedDrug(item);
        increment();
      }}
    >
      <View style={{ flexDirection: 'column' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.brand_name}</Text>
        <Text style={{ fontSize: 14, color: '#555' }}>Generic Name: {item.generic_name}</Text>
        <Text style={{ fontSize: 14, color: '#555' }}>Manufacturer: {item.manufacturer_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Welcome, {username}!</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#f44336', padding: 8, borderRadius: 4 }}
          onPress={() => router.replace('/')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TextInput
          style={{
            flex: 1,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 4,
            padding: 8,
            marginRight: 8,
          }}
          placeholder="Search drugs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={{ backgroundColor: '#4CAF50', padding: 8, borderRadius: 4 }}
          onPress={handleSearch}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Search</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <Text style={{ color: '#f44336', fontWeight: 'bold' }}>{error}</Text>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 16 }} />
      ) : (
        <FlatList
          data={drugs}
          renderItem={renderDrugItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginVertical: 16, color: '#777' }}>No drugs found</Text>}
        />
      )}

      <Modal
        visible={!!selectedDrug}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedDrug(null)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '80%', alignItems: 'center' }}>
            {selectedDrug && (
              <>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{selectedDrug.brand_name}</Text>
                <Text style={{ fontSize: 16, marginBottom: 8 }}>Generic Name: {selectedDrug.generic_name}</Text>
                <Text style={{ fontSize: 16, marginBottom: 8 }}>Manufacturer: {selectedDrug.manufacturer_name}</Text>
                <Button title="Close" onPress={() => setSelectedDrug(null)} />
              </>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          backgroundColor: '#4CAF50',
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{count}</Text>
      </TouchableOpacity>
    </View>
  );
}

interface ClickCountProviderProps {
  children: ReactNode;
}

export const ClickCountProvider: React.FC<ClickCountProviderProps> = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <ClickCountContext.Provider value={{ count, increment }}>
      {children}
    </ClickCountContext.Provider>
  );
};

const App: React.FC = () => (
  <ClickCountProvider>
    <HomeScreen />
  </ClickCountProvider>
);

export default App;