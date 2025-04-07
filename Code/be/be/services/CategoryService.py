from be.models.category import Category

class CategoryService:
    @staticmethod
    def get_all_categories():
        return Category.objects.all()
