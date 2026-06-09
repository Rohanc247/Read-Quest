import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/queryClient'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GameProvider } from '@/lib/gameContext';
import GameRoot from '@/components/game/GameRoot';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="*" element={<GameRoot />} />
          </Routes>
        </Router>
        <Toaster />
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App