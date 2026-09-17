import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm";
import "./Payment.css";
import { useAuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../hooks/apiFetch";
import useClearCart from "../../hooks/useClearCart";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

function Payment() {
  const user = useAuthContext();
  const location = useLocation();
  const totalPrice = location.state?.totalPrice ?? 0;
  const cartItems = location.state?.cartItems ?? [];
  const [clientSecret, setClientSecret] = useState("");
  const clearCart = useClearCart();

  if (!stripePromise) {
    return <p>Le paiement n'est pas encore configuré.</p>;
  }

  useEffect(() => {
    if (!totalPrice || totalPrice <= 0) return;

    apiFetch("/api/payment/create-intent", {
      method: "POST",
      body: JSON.stringify({ amount: totalPrice }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [totalPrice]);

  if (!clientSecret) {
    return <p>Chargement du paiement...</p>;
  }

  const handlePaymentSuccess = async () => {
    if (!user?.id) {
      console.error("Pas d'ID utilisateur trouvé.");
      return;
    }
    await clearCart(user.id);
  };

  return (
    <section className="payment-page">
      <h1>Finaliser votre commande</h1>
      <p>
        Total à payer : <strong>{totalPrice} €</strong>
      </p>

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm
          totalPrice={totalPrice}
          userId={user?.id ?? 0}
          cartItems={cartItems}
          onSuccess={handlePaymentSuccess}
        />
      </Elements>
    </section>
  );
}

export default Payment;
