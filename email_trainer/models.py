
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

Base = declarative_base()

class Zonetype(Base):
    __tablename__ = 'zonetypes'
    id = Column(Integer, primary_key=True)
    name = Column(String)

    def __repr__(self):
       return f"<Zonetype(name='{self.name}')>"

class Zoneline(Base):
    __tablename__ = 'zonelines'
    id = Column(Integer, primary_key=True)
    messageid = Column(Integer, ForeignKey('bodies.messageid'))
    linetext = Column(String)
    lineorder = Column(Integer)
    zoneannotation = relationship("Zoneannotation", uselist=False, back_populates="zoneline")

    def __repr__(self):
       return f"<Zoneline(messageid='{self.messageid}', linetext='{self.linetext}', lineorder='{self.lineorder}')>"

class Zoneannotation(Base):
    __tablename__ = 'zoneannotations'
    id = Column(Integer, primary_key=True)
    messageid = Column(Integer, ForeignKey('bodies.messageid'))
    lineid = Column(Integer, ForeignKey('zonelines.id'))
    zoneline = relationship("Zoneline", uselist=False, back_populates="zoneannotation")
    userid = Column(Integer)
    datetime = Column(DateTime)
    annvalue = Column(Integer, ForeignKey('zonetypes.id'))
    zonetype = relationship("Zonetype")
    errorid = Column(String, ForeignKey('errortypes.id'))
    errortype = relationship("Errortype")
    body = relationship("Body", back_populates="zoneannotations")

    def __repr__(self):
       return f"<Zoneannotation(messageid='({self.messageid})', lineid='{self.lineid}', nicknannvalueame='({self.nicknannvalueame})')>"

class Errortype(Base):
    __tablename__ = 'errortypes'
    id = Column(String, primary_key=True)
    name = Column(String)

    def __repr__(self):
       return f"<Zonetype(name='{self.name}')>"
   
class Header(Base):
    __tablename__ = 'headers'
    headerid = Column(Integer, primary_key=True)
    messageid = Column(Integer, ForeignKey('bodies.messageid'))
    headername = Column(String)
    headervalue = Column(String)
    body = relationship("Body", back_populates="headers")

    def __repr__(self):
       return f"<Header(headername='{self.headername}', headervalue='{self.headervalue}')>"

class Body(Base):
    __tablename__ = 'bodies'
    messageid = Column(Integer, primary_key=True)
    body = Column(String)
    zoneannotations = relationship("Zoneannotation", order_by=Zoneline.lineorder, back_populates="body")
    headers = relationship("Header", order_by=Header.headerid, back_populates="body")
    def __repr__(self):
       return f"<Body(body='{self.body}')>"

