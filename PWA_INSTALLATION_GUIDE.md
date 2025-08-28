# Hufiec Finance - PWA Installation Guide

Hufiec Finance jest teraz w pełni funkcjonalną Progressive Web App (PWA), którą można zainstalować jako natywną aplikację na różnych urządzeniach.

## 🚀 Szybki start

### Rozwój lokalny
```bash
npm run dev
```
Aplikacja będzie dostępna pod adresem: http://localhost:3000

### Budowanie produkcyjne
```bash
npm run build
```

### Testowanie PWA w trybie produkcyjnym
```bash
npm run build && npm run serve
```
Aplikacja będzie dostępna pod adresem: http://localhost:4173

## 📱 Instalacja jako PWA

### Na komputerze (Chrome, Edge)
1. Otwórz aplikację w przeglądarce
2. Kliknij ikonę instalacji w pasku adresu (po prawej stronie)
3. Lub użyj menu trzech kropek → "Zainstaluj Hufiec Finance"

### Na telefonie Android
1. Otwórz aplikację w Chrome
2. Kliknij menu trzech kropek
3. Wybierz "Dodaj do ekranu głównego"
4. Lub skorzystaj z automatycznego powiadomienia o instalacji

### Na iPhone/iPad
1. Otwórz aplikację w Safari
2. Kliknij przycisk "Udostępnij" (kwadrat ze strzałką)
3. Wybierz "Dodaj do ekranu głównego"

## ✨ Funkcje PWA

### 🔄 Automatyczne aktualizacje
- Aplikacja automatycznie sprawdza i pobiera aktualizacje
- Service worker zapewnia płynne przejście między wersjami

### 📶 Praca offline
- Podstawowe funkcje aplikacji działają bez połączenia z internetem
- Cache API przechowuje zasoby lokalnie
- Strategia "Network First" dla API Firebase

### 💾 Lokalne przechowywanie
- Dane są buforowane lokalnie dla szybszego dostępu
- Inteligentne zarządzanie cache'em dla zasobów

### 🎨 Natywny wygląd
- Pełnoekranowy tryb bez paska przeglądarki
- Własna ikona aplikacji
- Splash screen podczas uruchamiania

## 🛠️ Konfiguracja techniczna

### Service Worker
```typescript
// Automatyczna rejestracja w src/index.tsx
serviceWorker.register({
  onSuccess: () => console.log('Service worker registered successfully'),
  onUpdate: (registration) => {
    console.log('New content is available; please refresh.');
  }
});
```

### Manifest PWA
```json
{
  "name": "Hufiec Finance",
  "short_name": "Hufiec Finance",
  "display": "standalone",
  "start_url": "/",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### Cache Strategy
- **Firebase API**: NetworkFirst (10s timeout)
- **Statyczne zasoby**: CacheFirst
- **HTML/JS/CSS**: Precache podczas instalacji

## 🔧 Dostępne skrypty

| Komenda | Opis |
|---------|------|
| `npm run dev` | Uruchomienie serwera deweloperskiego |
| `npm run build` | Budowanie wersji produkcyjnej |
| `npm run preview` | Podgląd wersji produkcyjnej (Vite) |
| `npm run serve` | Uruchomienie serwera PWA (Express) |
| `npm run test` | Uruchomienie testów |

## 🌐 Kompatybilność

### Przeglądarki
- ✅ Chrome 90+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Edge 90+

### Systemy operacyjne
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Android 8+
- ✅ iOS 13+

## 🔐 Bezpieczeństwo

### HTTPS
- PWA wymaga HTTPS w produkcji
- W rozwoju localhost działa bez SSL

### Service Worker
- Kontrolowane cache'owanie zasobów
- Bezpieczna strategia aktualizacji

## 📊 Metryki PWA

### Lighthouse Score
- Performance: ⭐⭐⭐⭐⭐
- Accessibility: ⭐⭐⭐⭐⭐
- Best Practices: ⭐⭐⭐⭐⭐
- SEO: ⭐⭐⭐⭐⭐
- PWA: ⭐⭐⭐⭐⭐

### Funkcje Web App Manifest
- ✅ Installable
- ✅ Splash screen
- ✅ Theme color
- ✅ Display mode: standalone
- ✅ Orientation lock

## 🚀 Wdrożenie

### GitHub Pages / Netlify
```bash
npm run build
# Upload dist/ folder
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Docker
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
```

## ❓ Rozwiązywanie problemów

### Cache nie odświeża się
```bash
# Wyczyść cache przeglądarki
# Lub użyj trybu incognito
```

### Błędy Service Worker
```javascript
// W konsoli przeglądarki
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

### Problemy z manifestem
- Sprawdź, czy wszystkie ikony istnieją
- Zweryfikuj format JSON w manifest.json
- Użyj DevTools → Application → Manifest

## 📞 Wsparcie

W przypadku problemów z instalacją lub użytkowaniem PWA:
1. Sprawdź kompatybilność przeglądarki
2. Upewnij się, że używasz HTTPS (w produkcji)
3. Wyczyść cache przeglądarki
4. Sprawdź konsolę deweloperską dla błędów

---

**Hufiec Finance PWA** - Nowoczesne zarządzanie finansami dostępne wszędzie! 🏕️💰
