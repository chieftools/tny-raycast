import { OAuth } from "@raycast/api";

const clientId = "raycast_tny";
const tokenURL = "https://account.chief.app/api/oauth/token";
const authorizeURL = "https://account.chief.app/login/oauth/authorize";
const scopes = "profile email tny offline_access";

const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.App,
  providerName: 'tny',
  providerIcon: 'tny-icon.png',
  description: 'Login with your Tny account',
  providerId: "tny"
});

export async function authorize(): Promise<void> {
  const tokenSet = await client.getTokens();

  if (tokenSet?.accessToken) {
    if (tokenSet.refreshToken && tokenSet.isExpired()) {
      await client.setTokens(await refreshTokens(tokenSet.refreshToken));
    }
    return;
  }

  const authRequest = await client.authorizationRequest({
    endpoint: authorizeURL,
    clientId: clientId,
    scope: scopes,
  });

  const { authorizationCode } = await client.authorize(authRequest);
  await client.setTokens(await fetchTokens(authRequest, authorizationCode));
}

async function fetchTokens(authRequest: OAuth.AuthorizationRequest, authCode: string): Promise<OAuth.TokenResponse> {
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("code", authCode);
  params.append("code_verifier", authRequest.codeVerifier);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", authRequest.redirectURI);

  const response = await fetch(tokenURL, { method: "POST", body: params });
  if (!response.ok) {
    console.error("fetch tokens error:", await response.text());
    throw new Error(response.statusText);
  }
  return (await response.json()) as OAuth.TokenResponse;
}

async function refreshTokens(refreshToken: string): Promise<OAuth.TokenResponse> {
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("refresh_token", refreshToken);
  params.append("grant_type", "refresh_token");

  const response = await fetch(tokenURL, { method: "POST", body: params });
  if (!response.ok) {
    console.error("refresh tokens error:", await response.text());
    throw new Error(response.statusText);
  }
  const tokenResponse = (await response.json()) as OAuth.TokenResponse;
  tokenResponse.refresh_token = tokenResponse.refresh_token ?? refreshToken;
  return tokenResponse;
}

export async function getAccessToken()
{
  return (await client.getTokens())?.accessToken;
}
