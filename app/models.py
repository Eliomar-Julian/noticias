import sqlite3
import typing


class SQL:
    def __init__(self):
        self.conn = sqlite3.connect(
            "app/db/database.db", 
            check_same_thread=False
        )
        self.cursor = self.conn.cursor()

    # // cria qualquer tabela

    def create_table(self, name_table: str, **kwargs):
        cont_dict = len(kwargs.items())
        sintaxe = f"CREATE TABLE IF NOT EXISTS {name_table} ("
        for name_col, attr in kwargs.items():
            cont_dict -= 1
            sintaxe = sintaxe + (
                name_col + " " + attr.upper() + (
                    ", " if cont_dict > 0 else ""
                )
            )
        self.cursor.execute(sintaxe + ");")
        self.conn.commit()
    
    # // insere em qualquer tabela ja criada...
    
    def insert_in_table(self, table: str, 
        cols: typing.Iterable=list() or tuple(), 
        values: typing.Iterable=list() or tuple()):
        sintaxe = f"INSERT INTO {table} {cols} VALUES {values};".replace(
            "[", "(").replace("]", ")"
        )
        self.cursor.execute(sintaxe)
        self.conn.commit()

    # // busca valores especificos em qualquer campo

    def get_table_data(self, table: str, 
    col_name: str, value: str, all: bool=False):
        select = self.cursor.execute(
            f"SELECT * FROM {table} WHERE {col_name} = ?;", [value,]
        )
        if all: return select.fetchall()
        else: return select.fetchone()