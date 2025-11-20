import { define } from "../../utils.ts";
import { login, type LoginCredentials } from "@/lib/auth.ts";

interface LoginPageData {
  error?: string;
}

export const handler = define.handlers({
  GET(ctx) {
    // Check if user is already logged in
    const cookies = ctx.req.headers.get("cookie") || "";
    const authToken = cookies.match(/auth_token=([^;]+)/)?.[1];
    if (authToken) {
      return ctx.redirect("/admin/articles");
    }
    return { data: {} };
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) {
      return { data: { error: "Email and password are required" } };
    }

    try {
      const credentials: LoginCredentials = { email, password };
      const response = await login(credentials);

      // Backend returns { status: "success", data: { token, user } }
      if (response.status === "success" && response.data.token) {
        // Set cookie in response headers
        const headers = new Headers();
        headers.set(
          "Set-Cookie",
          `auth_token=${response.data.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${
            7 * 24 * 60 * 60
          }`,
        );
        headers.set("Location", "/admin/articles");

        return new Response(null, {
          status: 303,
          headers,
        });
      }

      return { data: { error: "Login failed" } };
    } catch (error) {
      console.error("Login error:", error);
      const message = error instanceof Error
        ? error.message
        : "Login failed. Please try again.";
      return { data: { error: message } };
    }
  },
});

export default define.page<typeof handler>(function LoginPage({ data }) {
  const pageData = data as LoginPageData;
  return (
    <div class="min-h-screen flex items-center justify-center bg-base-200">
      <div class="card w-full max-w-md bg-base-100 shadow-2xl">
        <div class="card-body">
          <div class="text-center mb-6">
            <div class="inline-block w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <span class="text-2xl font-bold text-white">TS</span>
            </div>
            <h2 class="card-title text-3xl font-bold justify-center">
              Admin Login
            </h2>
            <p class="text-base-content/60 mt-2">TStack Kit Dashboard</p>
          </div>

          {pageData.error && (
            <div class="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{pageData.error}</span>
            </div>
          )}

          <form method="POST" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control mt-6">
              <button type="submit" class="btn btn-primary w-full">
                Sign In
              </button>
            </div>
          </form>

          <div class="divider">Test Credentials</div>
          <div class="bg-base-200 rounded-lg p-4 space-y-1">
            <p class="text-sm">
              <span class="font-semibold">Email:</span>{" "}
              <span class="font-mono">dev-admin@example.com</span>
            </p>
            <p class="text-sm">
              <span class="font-semibold">Password:</span>{" "}
              <span class="font-mono">DevPassword123!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
