from django.http import JsonResponse
from django.core.cache import cache
from django.utils import timezone

IDLE_TIMEOUT = 60 * 60  # 1 hour

class IdleTimeoutMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = request.user

        if user.is_authenticated:
            key = f"last_activity_{user.id}"
            last_activity = cache.get(key)

            if not last_activity:
                return JsonResponse(
                    {"detail": "Session expired due to inactivity"},
                    status=401
                )

            # update last activity
            cache.set(key, timezone.now(), timeout=IDLE_TIMEOUT)

        response = self.get_response(request)
        return response
