class TBNode:
    def __init__(self, name, content):
        self.name = name
        self.content = content
        self.children = []
    
    def add_child(self, tbn):
        self.children.append(tbn)
    
    def to_dict(self):
        """
        Convert the TBNode tree structure to a dictionary that can be serialized into JSON.
        """
        return {
            'name': self.name,
            'content': self.content,
            'children': [child.to_dict() for child in self.children]
        }