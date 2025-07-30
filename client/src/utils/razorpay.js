import API from './api';

const loadRazorpay = async (type, pgId = null, userId) => {
    try {
        const token = localStorage.getItem('token');
        // console.log("Sending token:", token);
        const res = await API.post('/payment/order',
            { type, pgId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: res.data.amount,
            currency: 'INR',
            name: 'PGLink',
            description: type === 'single' ? 'Unlock Contact' : 'All Access',
            order_id: res.data.orderId,
            handler: async function (response) {
                await API.post('/payment/verify',
                    { userId, pgId, type },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )
                alert('Payment Successful! Access granted.');
                window.location.reload();

            },
            theme: {
                color: '#7C2D12',
            },

        }
        const razorpay = new window.Razorpay(options);
        razorpay.open();

    } catch (err) {
        


        console.log("❌ Full Error:", err);
        if (err.response && err.response.status === 401) {
            alert("⚠️ You need to log in before making a payment.");
            window.location.href = "/login"; // Or use React Router
        } else {
            alert("❌ Payment initialization failed. Try again later.");
        }

    }
}


export default loadRazorpay;