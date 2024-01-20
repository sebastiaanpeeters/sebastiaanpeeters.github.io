<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->

    
    <xsl:template match="tei:TEI">
                     <div class="row">
                         <div class="col">
                             <h4>About the manuscript page:</h4>
                             <xsl:value-of select="//tei:sourceDesc"/>
                             <xsl:value-of select="//tei:licence"/> <!-- You can change the way the metadata is visualised as well-->
                         </div>
                         <div class="col">
                            <ul> 
                                <li>Total number of modifications: 
                                    <xsl:value-of select="count(//tei:del|//tei:add)" /> <!-- Counts all the add and del elements, and puts it in a list item -->
                                </li>
                                <li>Number of additions: 
                                    <!-- count the additions only -->
                                    <xsl:value-of select="count(//tei:add)" />
                                </li>
                                <li>Number of deletions: 
                                    <!-- count the deletions only -->
                                    <xsl:value-of select="count(//tei:del)" />
                                </li>
                                <!-- add other list items in which you count things, such as the modifications made by Percy -->
                                <li>Number of corrections by Percy Shelley:
                                    <xsl:value-of select="count(//tei:del[@hand='#PBS']|//tei:add[@hand='#PBS'])" />
                                </li>
                                <li>Number of corrections by Mary Shelley:
                                    <xsl:value-of select="count(//tei:del[@hand='#MWS']|//tei:add[@hand='#MWS'])" />
                                </li>
                                <li>Number of lines on this page:
                                    <xsl:value-of select="count(//tei:lb) + 1" />
                                </li>
                                <!-- xpath 2.0 solution, need to find a 1.0 workaround>
                                <li>Number of words on this page:
                                    <xsl:value-of select="count(tokenize(string-join(//body//p/text())))" />
                                </li>
                                <-->
                            </ul>
                        </div>
                     </div>
        <hr/>
    </xsl:template>
    

</xsl:stylesheet>
