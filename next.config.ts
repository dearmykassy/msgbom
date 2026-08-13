import type { NextConfig } from "next";
import serviceCityRedirectsJson from "./src/data/service-city-region-redirects.generated.json";

type ServiceCityRedirectArtifact = {
  schemaVersion: number;
  status: string;
  counts: {
    redirects: number;
    destinationRepresentativeFamilies: number;
  };
  redirects: Array<{
    source: string;
    destination: string;
    permanent: boolean;
  }>;
};

const serviceCityRedirects =
  serviceCityRedirectsJson as ServiceCityRedirectArtifact;

if (
  serviceCityRedirects.schemaVersion !== 1 ||
  serviceCityRedirects.status !== "COMMITTED" ||
  serviceCityRedirects.counts.redirects !== 309 ||
  serviceCityRedirects.counts.destinationRepresentativeFamilies !== 111 ||
  serviceCityRedirects.redirects.length !== 309
) {
  throw new Error("SERVICE_CITY_REDIRECT_ARTIFACT_INTEGRITY_FAILURE");
}

const nextConfig: NextConfig = {
  async redirects() {
    return serviceCityRedirects.redirects.map(
      ({ source, destination, permanent }) => ({
        source,
        destination,
        permanent,
      }),
    );
  },
};

export default nextConfig;
