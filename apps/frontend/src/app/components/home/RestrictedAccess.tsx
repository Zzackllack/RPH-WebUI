export function RestrictedAccess() {
    return (
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-100 min-h-[60vh] flex items-center justify-center">
            <div className="glass-effect max-w-xl mx-auto p-10 rounded-2xl shadow-2xl text-center animate-fade-in">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    RPH-WebUI
                </h3>
                <p className="text-gray-600 mb-6">
                    Please log in to access the resource pack hosting dashboard.
                    <br />
                    RPH-WebUI is a minimal, modern platform for uploading and
                    managing Minecraft resource packs.
                </p>
            </div>
        </section>
    );
}
