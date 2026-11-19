
document.getElementById("year").textContent =
    new Date().getFullYear();

const announcementContainer =
    document.getElementById("announcement-container");

if (announcementContainer) {
    loadAnnouncements();
}

async function loadAnnouncements() {
    try {
        const response = await fetch(
            "content/announcements.json"
        );

        if (!response.ok) {
            throw new Error("Unable to load announcements.");
        }

        const data = await response.json();

        const announcements = (data.announcements || [])
            .filter(item => item.published === true)
            .sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );

        announcementContainer.replaceChildren();

        if (announcements.length === 0) {
            announcementContainer.innerHTML =
                '<div class="announcement-empty">' +
                'No announcements available at this time.' +
                '</div>';
            return;
        }

        announcements.forEach(item => {
            const card = document.createElement("article");
            card.className = "announcement-card";

            if (item.image) {
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.title || "Announcement";
                card.appendChild(img);
            }

            const body = document.createElement("div");
            body.className = "announcement-body";

            const category = document.createElement("span");
            category.className = "announcement-category";
            category.textContent = item.category || "Announcement";

            const date = document.createElement("small");
            date.className = "announcement-date";

            const parsedDate = new Date(item.date);

            date.textContent = Number.isNaN(parsedDate.getTime())
                ? ""
                : parsedDate.toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

            const title = document.createElement("h3");
            title.textContent = item.title || "";

            const description = document.createElement("p");
            description.textContent = item.description || "";

            body.append(category, date, title, description);
            card.appendChild(body);

            announcementContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);

        announcementContainer.textContent =
            "Unable to load announcements.";
    }
}

