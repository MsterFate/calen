from django.db import models

# Create your models here.

class Todo(models.Model):
    title = models.CharField(max_length=120)
    fecha_hora = models.DateTimeField()
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title