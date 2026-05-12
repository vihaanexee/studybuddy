import { apiGet, apiPut } from "./api";

export interface ConsentSettings {
  emotionTelemetryAllowed: boolean;
  webcamAllowed: boolean;
  retentionDays: number;
  updatedAt: string;
}

export async function getConsent(): Promise<ConsentSettings> {
  const res = await apiGet<{ data: ConsentSettings }>("/api/v1/consent");
  return res.data;
}

export async function updateConsent(
  settings: Partial<
    Pick<ConsentSettings, "emotionTelemetryAllowed" | "webcamAllowed" | "retentionDays">
  >,
): Promise<ConsentSettings> {
  const res = await apiPut<{ data: ConsentSettings }>("/api/v1/consent", settings);
  return res.data;
}
