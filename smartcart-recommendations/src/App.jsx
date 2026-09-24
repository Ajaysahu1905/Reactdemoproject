import RecommendationsWidget from './components/RecommendationsWidget.jsx'
import './App.css'

function App() {
  const handleAddToCart = (product) => {
    // eslint-disable-next-line no-console
    console.log('onAddToCart called with product:', product)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>smartcart-recommendations (standalone preview)</h1>
      <p>
        This app is normally consumed as a Module Federation remote. This
        page renders <code>RecommendationsWidget</code> directly so it can be
        exercised on its own with <code>npm run dev</code>.
      </p>
      <RecommendationsWidget
        currentProductId={2}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

export default App
