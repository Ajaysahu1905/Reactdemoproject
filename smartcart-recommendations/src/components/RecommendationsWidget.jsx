import './RecommendationsWidget.css'

// Local mock catalog for this remote — intentionally self-contained.
// Not fetched from any API and not shared with the host app.
const MOCK_PRODUCTS = [
  { id: 1, name: 'Wireless Mouse', price: 1999.99 },
  { id: 2, name: 'Mechanical Keyboard', price: 4999.99 },
  { id: 3, name: 'USB-C Hub', price: 299.5 },
  { id: 4, name: 'Laptop Stand', price: 349.0 },
  { id: 5, name: 'Noise Cancelling Headphones', price: 8999.99 },
  { id: 6, name: 'Webcam 1080p', price: 1399.99 },
]

function RecommendationsWidget({ currentProductId, onAddToCart }) {
  const recommendations = MOCK_PRODUCTS.filter(
    (product) => product.id !== currentProductId,
  ).slice(0, 3)

  const handleAddToCart = (product) => {
    if (typeof onAddToCart === 'function') {
      onAddToCart(product)
    }
  }

  return (
    <div className="recommendations-widget">
      <h2>Recommended Products</h2>
      <ul className="recommendations-list">
        {recommendations.map((product) => (
          <li key={product.id} className="recommendation-item">
            <span className="recommendation-name">{product.name}</span>
            <span className="recommendation-price">
              ₹{product.price.toFixed(2)}
            </span>
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecommendationsWidget
