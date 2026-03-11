from datetime import datetime

class LoveService:

    def __init__(self):
        # fecha cuando empezaron
        self.start_date = datetime(2025, 11, 12, 0, 0, 0)

    def get_counter(self):

        now = datetime.now()
        diff = now - self.start_date

        days = diff.days
        seconds = diff.seconds

        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60

        return {
            "since": self.start_date.strftime("%Y-%m-%d"),
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": secs,
            "text": f"Angel ❤️ Claudia desde hace {days} días"
        }


love_service = LoveService()