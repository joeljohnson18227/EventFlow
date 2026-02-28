const CUSTOM_DOMAIN_REGEX = /^(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/;

function stripPort(hostname = "") {
    const host = hostname.trim().toLowerCase();
    if (!host) return "";
    const parts = host.split(":");
    return parts[0];
}

export function normalizeDomain(value) {
    if (typeof value !== "string") return "";

    let domain = value.trim().toLowerCase();
    if (!domain) return "";

    domain = domain.replace(/^https?:\/\//, "");
    domain = domain.split("/")[0];
    domain = domain.replace(/\.$/, "");
    domain = stripPort(domain);

    return domain;
}

export function isValidCustomDomain(value) {
    const domain = normalizeDomain(value);
    return CUSTOM_DOMAIN_REGEX.test(domain);
}

export function getPlatformHosts() {
    const hosts = new Set(["localhost", "127.0.0.1", "::1"]);
    const envUrls = [process.env.NEXTAUTH_URL, process.env.NEXT_PUBLIC_APP_URL, process.env.APP_DOMAIN];

    for (const urlOrHost of envUrls) {
        if (!urlOrHost) continue;
        const normalized = normalizeDomain(urlOrHost);
        if (normalized) hosts.add(normalized);
    }

    return hosts;
}

export function isPlatformHost(hostname) {
    const host = normalizeDomain(hostname);
    if (!host) return true;
    if (host.endsWith(".localhost")) return true;
    return getPlatformHosts().has(host);
}
