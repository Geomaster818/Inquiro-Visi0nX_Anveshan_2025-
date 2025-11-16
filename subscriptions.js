let selectedPlan = "8";

document.querySelectorAll(".plan-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        selectedPlan = card.dataset.plan;
    });
});

document.querySelectorAll(".pay-option").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".pay-option").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");

        let method = btn.dataset.method;

        document.getElementById("cardFields").classList.toggle("active", method === "card");
        document.getElementById("upiFields").classList.toggle("active", method === "upi");
    });
});

document.getElementById("payBtn").addEventListener("click", () => {
    document.getElementById("modal").style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
});
